import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { JSX, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { TeamCard } from "@/components/TeamCard";
import { FaFileCsv, FaHome, FaSearch } from "react-icons/fa";
import { FilterNumber } from "@/components/FilterNumber";
import exportFromJSON from "export-from-json";
import Link from "next/link";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import { getServerSession, Session, User } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { FavouritedTeam, Team } from "@prisma/client";
import { teamNumberInRange } from "@/utils/team";
import { SEO } from "@/components/SEO";
import { getStorage, setStorage } from "@/utils/localStorage";
import { Loading } from "@/components/Loading";

const filterOptions = [
  { name: <FaHome aria-label="Home Button" />, range: "" },
  { name: "999s", range: "1-999" },
  { name: "1000s", range: "1000-2000" },
  { name: "2000s", range: "2000-3000" },
  { name: "3000s", range: "3000-4000" },
  { name: "4000s", range: "4000-5000" },
  { name: "5000s", range: "5000-6000" },
  { name: "6000s", range: "6000-7000" },
  { name: "7000s", range: "7000-8000" },
  { name: "8000s", range: "8000-9000" },
  { name: "9000s", range: "9000-9999" },
];

export default function TeamsPage({ user }: any): JSX.Element {
  const [teams, setTeams] = useState<any>();
  const [allTeams, setAllTeams] = useState<any>();
  const [teamExistsByTime, setTeamExistsByTime] = useState<any>({});
  const [time, setTime] = useState<any>();
  const [query, setQuery] = useState("");
  const [teamNumberRange, setTeamNumberRange] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(50);
  const [buttonClicked, setButtonClicked] = useState("");

  const itemsPerPage: number = 50;

  useEffect(() => {
    const fetchTeamData = async () => {
      const teamsFromStorage = getStorage("teams");
      if (teamsFromStorage) {
        setTeams(teamsFromStorage.sort(() => Math.random() - 0.5));
        return setAllTeams(teamsFromStorage.sort(() => Math.random() - 0.5));
      }

      const teams: Team[] = await fetch(`${API_URL}/api/teams/all`).then(
        (res) => res.json()
      );

      const sortedTeams: Team[] = [...teams].sort(() => Math.random() - 0.5);
      setStorage("teams", teams as unknown as string);
      setTeams(sortedTeams);
      return setAllTeams(sortedTeams);
    };

    fetchTeamData();
  }, []);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollPosition: number = window.innerHeight + window.scrollY;
      const contentHeight: number = document.documentElement.scrollHeight;

      if (scrollPosition > contentHeight * 0.8) {
        setStartIndex(endIndex + 1);
        setEndIndex(endIndex + itemsPerPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [startIndex, endIndex]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let previousTime: string = "";

      const interval: NodeJS.Timer = setInterval((): void => {
        const currentTime: string = new Date().toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
        });

        if (currentTime !== previousTime) {
          setTime(currentTime);
          setTeamExistsByTime(
            teams?.filter(
              (team: any): boolean =>
                team.team_number === Number(currentTime.replace(":", ""))
            )[0]
          );
          previousTime = currentTime;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [teams]);

  useEffect((): void => {
    if (query) {
      setAllTeams(
        teams?.filter((team: any) =>
          (team.team_number + team.nickname + team.city)
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    } else if (query.length === 0 && !teamNumberRange) {
      setAllTeams(teams);
    }
  }, [allTeams, query, teamNumberRange, teams]);

  useEffect((): void => {
    if (teamNumberRange) {
      setAllTeams(
        [...teams]
          .sort((a: any, b: any) => a.team_number - b.team_number)
          .filter((team: any) =>
            teamNumberInRange(team.team_number, teamNumberRange)
          )
      );
    } else if (teamNumberRange.length === 0) {
      setAllTeams(teams);
    }
  }, [teams, teamNumberRange]);

  const changeSearch = (event: { target: { value: string } }): void => {
    setQuery(event.target.value);
  };

  if (!allTeams || !teams) return <Loading />;
  const displayedTeams = allTeams.slice(0, endIndex);

  return (
    <>
      <>
        <SEO title="Teams / Scout Machine" />
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
                className="border bg-white border-solid dark:border-[#2A2A2A] dark:bg-card outline-none rounded-lg text-lightGray px-3 py-[6px] px-5 text-sm pl-8 md:w-[450px] mt-5"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-5">
                <FaSearch className="text-sm text-lightGray" />
              </span>
            </div>
            <div className="mt-3 gap-2 flex flex-wrap">
              {filterOptions.map(
                (
                  option:
                    | { name: JSX.Element; range: string }
                    | { name: string; range: string },
                  index: number
                ) => (
                  <FilterNumber
                    key={index}
                    name={option.name}
                    range={option.range}
                    setTeamNumberRange={setTeamNumberRange}
                    setButtonClicked={setButtonClicked}
                    buttonClicked={buttonClicked}
                  />
                )
              )}
            </div>
            <div>
              <button
                className="mt-2 border bg-white border-solid hover:bg-gray-100 dark:bg-card dark:hover:bg-[#191919] px-3 py-1 text-lightGray text-sm rounded-lg dark:border-[#2A2A2A] hover:text-black dark:hover:text-white "
                onClick={(): void => {
                  exportFromJSON({
                    data: teams,
                    fileName: `Teams_ScoutMachine_${CURR_YEAR}`,
                    exportType: exportFromJSON.types.csv,
                  });
                }}
              >
                <FaFileCsv className="mr-1 inline-block text-xs mb-[3px]" />{" "}
                Export Data (CSV)
              </button>
            </div>

            {teamExistsByTime && (
              <div className="mt-5">
                <b className="text-black dark:text-white">
                  Looks like the time is{" "}
                  <span className="text-primary">{time}.</span>
                </b>{" "}
                <Link
                  className="text-lightGray hover:text-primary"
                  href={`/team/${teamExistsByTime.team_number}`}
                >
                  Why don&apos;t ya check out {teamExistsByTime.team_number} |{" "}
                  {teamExistsByTime.nickname}?
                </Link>
              </div>
            )}
          </Header>

          <div className="w-full mx-auto pl-4 pr-4 md:pr-8 md:pl-8 mt-5">
            <div className="flex flex-col w-full sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {displayedTeams.map((team: any, key: number) => {
                return (
                  <TeamCard
                    key={key}
                    team={team}
                    favourites={user?.favouritedTeams}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <Footer />
      </>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}): Promise<{ props: { user: any } } | { props: {} }> => {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  if (session) {
    const user: (User & { favouritedTeams: FavouritedTeam[] }) | null =
      await db.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          favouritedTeams: true,
        },
      });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  }

  return { props: {} };
};
