/* eslint-disable @next/next/no-img-element */
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Navbar } from "@/components/navbar";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import db from "@/lib/db";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";

export default function InsightsPage({
  insights,
  totalMatches,
  totalEvents,
  totalTeams,
}: any): JSX.Element {
  const [avatars, setAvatars] = useState([]);

  useEffect((): void => {
    const fetchAvatars = async (): Promise<void> => {
      const teamAvatars: any = {};

      await Promise.all(
        insights.top.map(async (team: any): Promise<void> => {
          const data = await fetch(
            `${API_URL}/api/team/avatar?team=${team.teamNumber}`
          ).then((res: Response) => res.json());

          try {
            teamAvatars[team.teamNumber] = data.avatar;
          } catch {
            teamAvatars[team.teamNumber] = null;
          }
        })
      );

      setAvatars(teamAvatars);
    };

    fetchAvatars();
  }, [insights]);

  if (!avatars) return <Loading />;

  return (
    <>
      <Navbar />
      <Header
        title="Insights"
        desc={`An overview of insights on the ${CURR_YEAR} Season`}
      />

      <div className="pr-4 pl-4 md:pr-8 md:pl-8 max-w-screen-3xl w-full">
        <h1 className="font-bold text-2xl mt-5 text-white">
          Overall Insights{" "}
          <span className="text-lightGray text-sm font-medium">
            (since 1992)
          </span>
        </h1>
        <div className="grid grid-cols-3 mt-3 gap-3">
          <div className="text-lightGray rounded-lg bg-card py-5 px-8 border border-[#2A2A2A] ">
            <h1 className="text-2xl font-bold text-white">
              {totalTeams.toLocaleString()}
            </h1>{" "}
            teams registered
          </div>

          <div className="text-lightGray rounded-lg bg-card py-5 px-8 border border-[#2A2A2A] ">
            <h1 className="text-2xl font-bold text-white">
              {totalEvents.toLocaleString()}
            </h1>{" "}
            events hosted
          </div>
          <div className="text-lightGray rounded-lg bg-card py-5 px-8 border border-[#2A2A2A] ">
            <h1 className="text-2xl font-bold text-white">
              {totalMatches.toLocaleString()}
            </h1>{" "}
            matches played
          </div>
        </div>

        <h1 className="font-bold text-2xl mt-5 text-white">
          Top Performing Teams{" "}
          <span className="text-lightGray text-sm font-medium">
            (per district)
          </span>
        </h1>
        <div className="mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {insights.top.map((team: any, key: number) => {
            return (
              <div
                key={key}
                className="rounded-lg bg-card py-10 px-10 border border-[#2A2A2A] "
              >
                <Link href={`/teams/${team.teamNumber}`} className="flex mb-1">
                  <img
                    src={`data:image/jpeg;base64,${avatars[team.teamNumber]}`}
                    alt={`${team.teamNumber} Avatar`}
                    className="rounded-full h-8 w-8 mr-2"
                  />
                  <h1 className="text-2xl font-bold text-white">
                    Team {team.teamNumber}
                  </h1>
                </Link>
                <p className="text-lightGray">
                  #1 in the{" "}
                  <Link
                    href="/districts"
                    className="text-black dark:text-white"
                  >
                    {team.districtCode} District
                  </Link>{" "}
                  scoring a total of {team.totalPoints} Ranking Points. <br />{" "}
                  <br />
                  {team.teamNumber} has scored a total of{" "}
                  {team.event1Points + team.event2Points} points at their 2
                  competitions. In{" "}
                  <Link
                    href={`/events/2023${team.event1Code.toLowerCase()}`}
                    className="text-black dark:text-white"
                  >
                    {team.event1Code}
                  </Link>
                  , scoring {team.event1Points} points, and in{" "}
                  <Link
                    href={`/events/2023${team.event2Code.toLowerCase()}`}
                    className="text-black dark:text-white"
                  >
                    {team.event2Code}
                  </Link>
                  , scoring {team.event2Points} points.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const insightsData = await fetch(`${API_URL}/api/insights`).then(
    (res: Response) => res.json()
  );

  const [totalMatches, totalEvents, totalTeams] = await Promise.all([
    await db.match.count(),
    await db.event.count(),
    await db.team.count(),
  ]);

  return {
    props: { insights: insightsData, totalMatches, totalEvents, totalTeams },
  };
}
