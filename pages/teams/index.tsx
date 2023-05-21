import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { useState, useEffect, useRef, JSX, MutableRefObject } from "react";
import { Header } from "@/components/Header";
import { TeamCard } from "@/components/TeamCard";
import { FaFileCsv, FaHome, FaSearch } from "react-icons/fa";
import Head from "next/head";
import { getStorage, setStorage } from "@/utils/localStorage";
import { Loading } from "@/components/Loading";
import { formatTime } from "@/utils/time";
import { log } from "@/utils/log";
import { teamNumberInRange } from "@/utils/team";
import { FilterNumber } from "@/components/FilterNumber";
import { fetchTeamsData as fetchTeams } from "@/utils/team";
import exportFromJSON from "export-from-json";
import Link from "next/link";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import {getServerSession, Session, User} from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import {FavouritedTeam} from "@prisma/client";

async function fetchTeamsData(
  startIndex: number,
  endIndex: number,
  teamNumberRange: string = "",
  searchTerm: string = ""
) {
  await fetchTeams();

  const teamsData = getStorage(`teams_${CURR_YEAR}`);
  const teamAvatarsData = getStorage(`cached_avatars_${CURR_YEAR}`);
  const sortedTeams = teamsData.sort(() => Math.random() - 0.5);
  const teamsSlice = sortedTeams.slice(startIndex, endIndex);

  if (teamsData && teamAvatarsData) {
    const filteredTeams = teamsData.filter((team: any) =>
      (team.team_number + team.nickname + team.city)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return {
      teams: searchTerm
        ? filteredTeams.slice(startIndex, endIndex)
        : teamNumberRange
        ? teamsData.filter((team: any) =>
            teamNumberInRange(team.team_number, teamNumberRange)
          )
        : sortedTeams.slice(0, 50),
      avatars: teamAvatarsData,
    };
  }

  const teamAvatars: any = {};
  const start: number = performance.now();

  await Promise.all(
    sortedTeams.slice(0, 50).map(async (team: any): Promise<void> => {
      const avatar = await fetch(
        `${API_URL}/api/team/avatar?team=${team.team_number}`
      ).then((res: Response) => res.json());

      try {
        teamAvatars[team.team_number] = avatar.avatar;
      } catch {
        teamAvatars[team.team_number] = null;
      }
    })
  );

  log("warning", `Fetched avatars in ${formatTime(performance.now() - start)}`);
  setStorage(`cached_avatars_${CURR_YEAR}`, teamAvatars);

  return {
    teams: teamNumberRange
      ? teamsSlice.filter((team: any) =>
          teamNumberInRange(team.team_number, teamNumberRange)
        )
      : teamsSlice,
    avatars: teamAvatars,
  };
}

export default function TeamsPage({ user }: any): JSX.Element {
  const [isClient, setIsClient] = useState(false);
  const [teamExistsByTime, setTeamExistsByTime] = useState<any>({});
  const [time, setTime] = useState<any>();
  const [teams, setTeams] = useState<any>([]);
  const [query, setQuery] = useState("");
  const [avatars, setAvatars] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(50);
  const [teamNumberRange, setTeamNumberRange] = useState("");
  const itemsPerPage = 50;

  const loadingScreenShown: MutableRefObject<boolean> = useRef(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = (): void => {
      const scrollPosition: number = window.innerHeight + window.pageYOffset;
      const contentHeight: number = document.documentElement.scrollHeight;

      if (scrollPosition > contentHeight * 0.8) {
        setStartIndex(endIndex + 1);
        setEndIndex(endIndex + itemsPerPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [startIndex, endIndex]);

  useEffect((): void => {
    const fetchTeams = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const { teams, avatars } = await fetchTeamsData(startIndex, endIndex);
        setTeams((prevTeams: any) => [...prevTeams, ...teams]);
        setAvatars(avatars);
      } catch (error) {
        setIsLoading(true);
        log("error", "Failed to fetch teams");
      } finally {
        setIsLoading(false);
      }
    };

    if (!loadingScreenShown.current) {
      fetchTeams().then((): void => {
        loadingScreenShown.current = true;
      });
    } else {
      fetchTeams();
    }
  }, [startIndex, endIndex]);

  const changeSearch = async (event: {
    target: { value: string };
  }): Promise<void> => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);
    setStartIndex(0);
    setEndIndex(itemsPerPage);

    const { teams, avatars } = await fetchTeamsData(
      0,
      itemsPerPage,
      "",
      searchTerm
    );
    setTeams(teams);
    setAvatars(avatars);
  };

  useEffect((): void => {
    const filterByNumber = async (): Promise<void> => {
      const { teams, avatars } = await fetchTeamsData(
        startIndex,
        endIndex,
        teamNumberRange,
        query
      );
      setTeams(teams);
      setAvatars(avatars);
    };

    if (teamNumberRange) {
      filterByNumber();
    }
  }, [endIndex, query, startIndex, teamNumberRange]);

  useEffect(() => {
    if (typeof window !== "undefined" && getStorage(`teams_${CURR_YEAR}`)) {
      const interval: NodeJS.Timer = setInterval((): void => {
        const time: string = new Date().toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
        });
        setTime(time);
        setTeamExistsByTime(
          getStorage(`teams_${CURR_YEAR}`).filter(
            (team: any): boolean =>
              team.team_number === Number(time.replace(":", ""))
          )[0]
        );
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  if (!teams && !avatars && isLoading) {
    return <Loading />;
  }

  return (
    <>
      {isClient && (
        <>
          <Head>
            <title>Teams | Scout Machine</title>
          </Head>
          <Navbar active="Teams" />

          <div className="flex flex-col">
            <Header
              title="Teams"
              desc="Unleash the excitement of FRC with a new way to discover teams"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teams (team #, location, name)..."
                  value={query}
                  onChange={changeSearch}
                  spellCheck="false"
                  className="border border-[#2A2A2A] bg-card outline-none rounded-lg text-lightGray px-3 py-[6px] px-5 text-sm pl-8 md:w-[450px] mt-5"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-5">
                  <FaSearch className="text-sm text-lightGray" />
                </span>
              </div>
              <div className="mt-3 gap-2 flex flex-wrap">
                <FilterNumber
                  name={<FaHome />}
                  reload
                  range=""
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="999s"
                  range="1-999"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="1000s"
                  range="1000-2000"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="2000s"
                  range="2000-3000"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="3000s"
                  range="3000-4000"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="4000s"
                  range="4000-5000"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="5000s"
                  range="5000-6000"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="6000s"
                  range="6000-7000"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="7000s"
                  range="7000-8000"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="8000s"
                  range="8000-0000"
                  setTeamNumberRange={setTeamNumberRange}
                />
                <FilterNumber
                  name="9000s"
                  range="9000-9999"
                  setTeamNumberRange={setTeamNumberRange}
                />
              </div>
              <div>
                <button
                  className="mt-2 bg-card hover:bg-[#191919] px-3 py-1 text-lightGray text-sm rounded-lg border border-[#2A2A2A] hover:text-white transition-all duration-150"
                  onClick={() => {
                    exportFromJSON({
                      data: getStorage(`teams_${CURR_YEAR}`),
                      fileName: `Teams_ScoutMachine_${CURR_YEAR}`,
                      exportType: exportFromJSON.types.csv,
                    });
                  }}
                >
                  <FaFileCsv className="mr-1 inline-block text-xs mb-[3px]" />{" "}
                  Export Data (CSV)
                </button>
              </div>{" "}
              <br />
              {teamExistsByTime && (
                <div>
                  <b className="text-primary">Looks like the time is {time}.</b>{" "}
                  <Link
                    className="hover:text-primary"
                    href={`/teams/${teamExistsByTime.team_number}`}
                  >
                    Perhaps check out {teamExistsByTime.team_number} |{" "}
                    {teamExistsByTime.nickname}?
                  </Link>
                </div>
              )}
            </Header>

            <div className="w-full mx-auto pl-4 pr-4 md:pr-8 md:pl-8 mt-5">
              <div className="flex flex-col w-full sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {teams.map((team: any, key: number) => {
                  return (
                    <TeamCard
                      key={key}
                      team={team}
                      avatars={avatars}
                      favourites={user?.favouritedTeams}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }):  Promise<{props: {user: any}} | {props: {}}> => {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  if (session) {
    const user: (User & {favouritedTeams: FavouritedTeam[]}) | null = await db.user.findUnique({
      where: {
        // @ts-ignore
        id: session.user.id,
      },
      include: {
        favouritedTeams: true,
      },
    });

    return { props: { user: JSON.parse(JSON.stringify(user)) } };
  }

  return { props: {} };
};
