import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { CURR_YEAR } from "@/lib/constants";
import { useState, useEffect, JSX } from "react";
import { Header } from "@/components/Header";
import { TeamCard } from "@/components/TeamCard";
import { FaFileCsv, FaHome, FaSearch } from "react-icons/fa";
import Head from "next/head";
import { getStorage } from "@/utils/localStorage";
import { FilterNumber } from "@/components/FilterNumber";
import exportFromJSON from "export-from-json";
import Link from "next/link";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import { getServerSession, Session, User } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { FavouritedTeam } from "@prisma/client";
import { teamNumberInRange } from "@/utils/team";

const filterOptions = [
  { name: <FaHome />, range: "" },
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

export default function TeamsPage({ user, teams, avatars }: any): JSX.Element {
  const [allTeams, setAllTeams] = useState(teams);
  const [isClient, setIsClient] = useState(false);
  const [teamExistsByTime, setTeamExistsByTime] = useState<any>({});
  const [time, setTime] = useState<any>();
  const [query, setQuery] = useState("");
  const [teamNumberRange, setTeamNumberRange] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(50);
  const [buttonClicked, setButtonClicked] = useState("");

  const itemsPerPage = 50;
  const displayedTeams = allTeams.slice(0, endIndex);

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

  useEffect(() => {
    if (typeof window !== "undefined" && getStorage(`teams_${CURR_YEAR}`)) {
      let previousTime: string = "";

      const interval: NodeJS.Timer = setInterval(() => {
        const currentTime: string = new Date().toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
        });

        if (currentTime !== previousTime) {
          setTime(currentTime);
          setTeamExistsByTime(
            getStorage(`teams_${CURR_YEAR}`).filter(
              (team: any) =>
                team.team_number === Number(currentTime.replace(":", ""))
            )[0]
          );
          previousTime = currentTime;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (query) {
      setAllTeams(
        teams.filter((team: any) =>
          (team.team_number + team.nickname + team.city)
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    } else if (query.length === 0 && !teamNumberRange) {
      setAllTeams(teams);
    }
  }, [allTeams, query, teamNumberRange, teams]);

  useEffect(() => {
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

  const changeSearch = (event: { target: { value: string } }) => {
    setQuery(event.target.value);
  };

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
                  className="border bg-white border-solid dark:border-[#2A2A2A] dark:bg-card outline-none rounded-lg text-lightGray px-3 py-[6px] px-5 text-sm pl-8 md:w-[450px] mt-5"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-5">
                  <FaSearch className="text-sm text-lightGray" />
                </span>
              </div>
              <div className="mt-3 gap-2 flex flex-wrap">
                {filterOptions.map((option, index) => (
                  <FilterNumber
                    key={index}
                    name={option.name}
                    range={option.range}
                    setTeamNumberRange={setTeamNumberRange}
                    setButtonClicked={setButtonClicked}
                    buttonClicked={buttonClicked}
                  />
                ))}
              </div>
              <div>
                <button
                  className="mt-2 border bg-white border-solid hover:bg-gray-100 dark:bg-card dark:hover:bg-[#191919] px-3 py-1 text-lightGray text-sm rounded-lg dark:border-[#2A2A2A] hover:text-black dark:hover:text-white transition-all duration-150"
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
                  <b className="text-black dark:text-white">
                    Looks like the time is{" "}
                    <span className="text-primary">{time}.</span>
                  </b>{" "}
                  <Link
                    className="text-lightGray hover:text-primary"
                    href={`/teams/${teamExistsByTime.team_number}`}
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}): Promise<{ props: { user: any } } | { props: {} }> => {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  const teams = await db.team.findMany();
  const sortedTeams = [...teams].sort(() => Math.random() - 0.5);
  const teamAvatars: any = {};

  if (session) {
    const user: (User & { favouritedTeams: FavouritedTeam[] }) | null =
      await db.user.findUnique({
        where: {
          // @ts-ignore
          id: session.user.id,
        },
        include: {
          favouritedTeams: true,
        },
      });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        teams: sortedTeams,
        avatars: teamAvatars,
      },
    };
  }

  return {
    props: {
      teams: sortedTeams,
      avatars: teamAvatars,
    },
  };
};
