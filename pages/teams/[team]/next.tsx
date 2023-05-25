import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { API_URL, COMP_SEASON } from "@/lib/constants";
import {
  epochSecondsToTime,
  formatEpochSecondsToDate,
  formatRelativeTime,
} from "@/utils/time";
import { GetServerSideProps } from "next";
import {
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaRedo,
  FaUndo,
} from "react-icons/fa";
import { GoPrimitiveDot } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NextTeamMatch({ next, avatars, epas }: any) {
  const router = useRouter();
  const teamQuery = router.query.team;
  const [refreshIcon, setRefreshIcon] = useState(false);

  const refreshData = () => {
    setRefreshIcon(true);
    router.replace(router.asPath);
  };

  useEffect(() => {
    if (COMP_SEASON) {
      const refreshTimer = setTimeout(() => {
        setRefreshIcon(true);
        router.replace(router.asPath);
      }, 120000);

      return () => {
        setRefreshIcon(false);
        clearTimeout(refreshTimer);
      };
    }
  }, [router]);

  const toEpochSeconds = new Date(next.match?.startTime).getTime();
  const redAlliance = next.match?.teams.filter((team: any) =>
    team.station.includes("Red")
  );
  const blueAlliance = next.match?.teams.filter((team: any) =>
    team.station.includes("Blue")
  );
  const teamAlliance = next.match?.teams
    .find((team: any) => team.teamNumber === Number(teamQuery))
    .station.replace(/[0-9]/g, "");

  const isTimeInPast = (time: string): boolean => {
    const currentTime: Date = new Date();
    const targetTime: Date = new Date(time);
    return targetTime < currentTime;
  };

  const [redAllianceWinRate, setRedAllianceWinRate] = useState(0);
  const [blueAllianceWinRate, setBlueAllianceWinRate] = useState(0);

  useEffect(() => {
    let redWinRate = 0;
    let blueWinRate = 0;

    redAlliance?.forEach((team: any) => {
      redWinRate += epas[team.teamNumber].winrate;
    });

    blueAlliance?.forEach((team: any) => {
      blueWinRate += epas[team.teamNumber].winrate;
    });

    setRedAllianceWinRate(redWinRate);
    setBlueAllianceWinRate(blueWinRate);
  }, [redAlliance, blueAlliance, epas]);

  const getWinningAlliance = (): string => {
    if (redAllianceWinRate > blueAllianceWinRate) {
      return "Red";
    } else if (blueAllianceWinRate > redAllianceWinRate) {
      return "Blue";
    } else {
      return "Tie";
    }
  };

  if (!next.match) {
    return (
      <>
        <Navbar />

        <div className="pl-4 pr-4 md:pr-8 md:pl-8 max-w-screen-3xl mt-10">
          <div className="bg-card mb-5 p-5 rounded-lg border dark:border-[#2A2A2A]">
            <p className="text-center text-red-500">
              Oh no... we tried our hardest but we&apos;re unable to process{" "}
              {teamQuery}&apos;s next match. <br />
            </p>
            <p className="text-center text-black dark:text-white">
              Please try again or come back later.
            </p>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="pl-4 pr-4 md:pr-8 md:pl-8 max-w-screen-3xl mt-10">
        <div className="bg-card mb-5 p-5 rounded-lg border dark:border-[#2A2A2A]">
          <p className="text-lightGray text-center">
            {formatEpochSecondsToDate(toEpochSeconds, true)} •{" "}
            {next.match?.tournamentLevel} Match
          </p>
          <h1 className="text-black dark:text-lightGray text-2xl text-center">
            <b>
              {isTimeInPast(next.match?.startTime)
                ? "Last Match:"
                : "Upcoming:"}
            </b>{" "}
            <span className="text-white">{next.match?.description}</span> on{" "}
            <span className="text-white">{next.match?.field} Field</span> at{" "}
            <span className="text-white">
              {epochSecondsToTime(toEpochSeconds, true)}
            </span>
          </h1>
          <p className="text-lightGray text-center">
            {next.event.name} at{" "}
            <b>
              {next.event.location_name}, {next.event.state_prov},{" "}
              {next.event.city}, {next.event.country}
            </b>
          </p>

          <div className="flex flex-row gap-3 items-center justify-center">
            {COMP_SEASON && (
              <button
                onClick={refreshData}
                className="text-sm flex mt-3 bg-[#191919] border dark:border-[#2A2A2A] text-center text-lightGray hover:text-white transition-all duration-150 py-2 px-5 rounded-lg"
              >
                <FaRedo
                  className={`mr-2 text-xs mt-[4px] ${refreshIcon && "spin"}`}
                />{" "}
                {refreshIcon ? "Refreshing..." : "Refresh Data"}
              </button>
            )}

            {isTimeInPast(next.match?.startTime) && (
              <span className="text-sm flex mt-3 bg-[#191919] border dark:border-[#2A2A2A] text-center text-green-400 py-2 px-5 rounded-lg">
                <GoPrimitiveDot className="mr-1 text-xl" /> Match Completed{" "}
                {formatRelativeTime(next.match?.startTime)}
              </span>
            )}
            <span className="text-sm flex mt-3 bg-[#191919] border dark:border-[#2A2A2A] text-center text-yellow-400 py-2 px-5 rounded-lg">
              <FaUndo className="mr-2 text-xs mt-[4px]" /> Previous Match:{" "}
              {next.previous.description}
            </span>
          </div>

          <p className="text-center text-lightGray mt-2">
            <b>Team {teamQuery}</b> is on the{" "}
            <span
              className={`${
                teamAlliance === "Red" ? "text-red-400" : "text-sky-400"
              }`}
            >
              {teamAlliance} Alliance
            </span>{" "}
          </p>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
          <div className="bg-red-500 rounded-md p-5">
            <h1 className="text-3xl font-bold mb-4 text-red-200 text-center">
              Red Alliance{" "}
              <button className="cursor-default bg-red-600 rounded-lg text-sm align-middle py-1 px-3 text-white">
                <span className="flex">
                  Win Avg (
                  {((Number(redAllianceWinRate.toFixed(2)) / 3) * 100).toFixed(
                    2
                  )}
                  %){" "}
                  {getWinningAlliance() === "Red" ? (
                    <FaArrowAltCircleUp className="text-md ml-1 mt-[3px]" />
                  ) : (
                    <FaArrowAltCircleDown className="text-md ml-1 mt-[3px]" />
                  )}
                </span>
              </button>
            </h1>

            <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
              {redAlliance.map((team: any, key: number) => {
                return (
                  <Link key={key} href={`/teams/${team.teamNumber}`}>
                    <div
                      className={`${
                        Number(teamQuery) === team.teamNumber
                          ? "bg-red-600"
                          : "bg-red-400"
                      } hover:bg-red-600 rounded-lg py-5`}
                    >
                      <p className="text-center text-sm font-semibold text-red-200 mb-1">
                        {epas[team.teamNumber].name}
                      </p>
                      <h1
                        className={`text-xl flex items-center justify-center ${
                          team.surrogate ? "text-lightGray" : "text-white"
                        } font-bold`}
                      >
                        {avatars[team.teamNumber] ? (
                          <Image
                            className="rounded-lg mr-4 w-7"
                            alt={`Team ${team.teamNumber} Avatar`}
                            height="50"
                            width="50"
                            priority={true}
                            src={`data:image/jpeg;base64,${
                              avatars[team.teamNumber]
                            }`}
                          />
                        ) : (
                          <Image
                            className="mr-2 w-8"
                            alt="FIRST Logo"
                            height="50"
                            width="50"
                            priority={true}
                            src={`/first-icon.svg`}
                          />
                        )}{" "}
                        Team {team.teamNumber}
                      </h1>
                      <p className="text-red-200 text-center text-xs mt-1">
                        {epas[team.teamNumber].winrate.toFixed(2)}% WR,{" "}
                        {epas[team.teamNumber].wins} Ws, &{" "}
                        {epas[team.teamNumber].losses} Ls
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-sky-500 rounded-md p-5">
            <h1 className="text-3xl font-bold mb-4 text-sky-200 text-center">
              Blue Alliance{" "}
              <button className="cursor-default bg-sky-600 rounded-lg text-sm align-middle py-1 px-3 text-white">
                <span className="flex">
                  Win Avg (
                  {((Number(blueAllianceWinRate.toFixed(2)) / 3) * 100).toFixed(
                    2
                  )}
                  %)
                  {getWinningAlliance() === "Blue" ? (
                    <FaArrowAltCircleUp className="text-md ml-1 mt-[3px]" />
                  ) : (
                    <FaArrowAltCircleDown className="text-md ml-1 mt-[3px]" />
                  )}
                </span>
              </button>
            </h1>

            <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
              {blueAlliance.map((team: any, key: number) => {
                return (
                  <Link key={key} href={`/teams/${team.teamNumber}`}>
                    <div
                      className={`${
                        Number(teamQuery) === team.teamNumber
                          ? "bg-sky-600"
                          : "bg-sky-400"
                      } hover:bg-sky-600 rounded-lg py-5`}
                    >
                      <p className="text-center text-sm font-semibold text-sky-200 mb-1">
                        {epas[team.teamNumber].name}
                      </p>
                      <h1
                        className={`text-xl flex items-center justify-center ${
                          team.surrogate ? "text-lightGray" : "text-white"
                        } font-bold`}
                      >
                        {avatars[team.teamNumber] ? (
                          <Image
                            className="rounded-lg mr-4 w-7"
                            alt={`Team ${team.teamNumber} Avatar`}
                            height="50"
                            width="50"
                            priority={true}
                            src={`data:image/jpeg;base64,${
                              avatars[team.teamNumber]
                            }`}
                          />
                        ) : (
                          <Image
                            className="mr-2 w-8"
                            alt="FIRST Logo"
                            height="50"
                            width="50"
                            priority={true}
                            src={`/first-icon.svg`}
                          />
                        )}{" "}
                        Team {team.teamNumber}
                      </h1>
                      <p className="text-sky-200 text-center text-xs mt-1">
                        {epas[team.teamNumber].winrate.toFixed(2)}% WR,{" "}
                        {epas[team.teamNumber].wins} Ws, &{" "}
                        {epas[team.teamNumber].losses} Ls
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { team }: any = context.params;

  const nextMatch = await fetch(`${API_URL}/api/team/next?team=${team}`).then(
    (res) => res.json()
  );

  const teamAvatars: any = {};
  const matchEPAs: any = {};

  if (nextMatch.match) {
    await Promise.all(
      nextMatch.match.teams.map(async (team: any): Promise<void> => {
        const data = await fetch(
          `${API_URL}/api/team/avatar?team=${team.teamNumber}`
        ).then((res: Response) => res.json());
        const epa = await fetch(
          `https://api.statbotics.io/v2/team/${team.teamNumber}`
        ).then((res) => res.json());

        try {
          teamAvatars[team.teamNumber] = data.avatar;
          matchEPAs[team.teamNumber] = epa;
        } catch {
          teamAvatars[team.teamNumber] = null;
          matchEPAs[team.teamNumber] = null;
        }
      })
    );
  }

  return { props: { next: nextMatch, avatars: teamAvatars, epas: matchEPAs } };
};
