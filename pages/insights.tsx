/* eslint-disable @next/next/no-img-element */
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Navbar } from "@/components/navbar";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import db from "@/lib/db";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";
import { MostPointsTable } from "../components/insights/MostPointsTable";
import { Award, Match, Team } from "@prisma/client";

export default function InsightsPage({
  insights,
  totalMatches,
  totalEvents,
  totalTeams,
  top10Teams,
  mostQualMatchPts,
  mostPlayoffMatchPts,
}: any): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [avatars, setAvatars] = useState([]);

  useEffect((): void => {
    const fetchAvatars = async (): Promise<void> => {
      setLoading(true);
      const teamAvatars: any = {};

      await Promise.all(
        [
          ...top10Teams.map((team: any) => ({
            teamNumber: team.teamNumber.substring(3),
          })),
          ...insights.top,
        ].map(async (team: any): Promise<void> => {
          const data = await fetch(
            `${API_URL}/api/teams/avatar?team=${team.teamNumber}`
          ).then((res: Response) => res.json());

          try {
            teamAvatars[team.teamNumber] = data.avatar;
          } catch {
            teamAvatars[team.teamNumber] = null;
          }
        })
      );

      setAvatars(teamAvatars);
      setLoading(false);
    };

    fetchAvatars();
  }, [insights, top10Teams]);

  if (loading) return <Loading />;

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
        <div className="flex flex-col md:grid md:grid-cols-3 mt-3 gap-3">
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
          Most Banners Won{" "}
          <span className="text-lightGray text-sm font-medium">
            (championship wins, woodie flowers, & impact/chairmans award)
          </span>
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full mt-5 text-sm text-left bg-[#191919] border border-[#2A2A2A]">
            <thead className="text-xs text-black dark:text-white uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Team #
                </th>
                <th scope="col" className="px-6 py-3">
                  # of Awards
                </th>
              </tr>
            </thead>
            <tbody>
              {top10Teams.map((team: any, key: number) => {
                return (
                  <tr
                    key={key}
                    className="group text-lightGray border border-[#2A2A2A] bg-card hover:bg-[#191919]"
                  >
                    <td
                      scope="row"
                      className="group-hover:text-primary px-6 py-4 whitespace-nowrap text-xl font-semibold text-lightGray"
                    >
                      <Link href={`/team/${team.teamNumber.substring(3)}`}>
                        <div className="flex">
                          <img
                            src={`data:image/jpeg;base64,${
                              avatars[team.teamNumber.substring(3)]
                            }`}
                            alt={`${team.teamNumber} Avatar`}
                            className="h-8 w-8 mr-2"
                          />{" "}
                          <p>
                            <span className="text-white">
                              {team.teamNumber.substring(3)}
                            </span>{" "}
                            | {team.name}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="group-hover:text-primary px-6 py-4 whitespace-nowrap text-xl text-lightGray">
                      {team.numAwards}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <MostPointsTable
          qualMatches={mostQualMatchPts}
          playoffMatches={mostPlayoffMatchPts}
        />

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
                <Link href={`/team/${team.teamNumber}`} className="flex mb-1">
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
                    href={`/event/2023${team.event1Code.toLowerCase()}`}
                    className="text-black dark:text-white"
                  >
                    {team.event1Code}
                  </Link>
                  , scoring {team.event1Points} points, and in{" "}
                  <Link
                    href={`/event/2023${team.event2Code.toLowerCase()}`}
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

export async function getServerSideProps(): Promise<{
  props: {
    insights: any;
    totalMatches: number;
    totalEvents: number;
    totalTeams: number;
    top10Teams: {
      teamNumber: string;
      name: string | null | undefined;
      numAwards: number;
    }[];
    mostQualMatchPts: any;
    mostPlayoffMatchPts: any;
  };
}> {
  const insightsData = await fetch(`${API_URL}/api/insights`).then(
    (res: Response) => res.json()
  );

  const [totalMatches, totalEvents, totalTeams, awards] = await Promise.all([
    await db.match.count(),
    await db.event.count(),
    await db.team.count(),
    await db.award.findMany(),
  ]);

  const getMatchData = async (
    eventKey: string,
    compLevels: string[],
    take: number
  ): Promise<any> => {
    const withoutPenaltyData: Match[] = await db.match.findMany({
      where: {
        event_key: {
          contains: eventKey,
        },
        comp_level: {
          in: compLevels,
        },
        AND: [
          {
            score_breakdown: {
              path: ["red", "foulPoints"],
              equals: 0,
            },
          },
          {
            score_breakdown: {
              path: ["blue", "foulPoints"],
              equals: 0,
            },
          },
        ],
      },
      orderBy: {
        alliances: "desc",
      },
      take,
    });

    const withPenaltyData: Match[] = await db.match.findMany({
      where: {
        event_key: {
          contains: eventKey,
        },
        comp_level: {
          in: compLevels,
        },
      },
      orderBy: {
        alliances: "desc",
      },
      take,
    });

    return JSON.parse(
      JSON.stringify(
        { withPenaltyData, withoutPenaltyData },
        (key: string, value) =>
          typeof value === "bigint" ? value.toString() : value // return everything else unchanged
      )
    );
  };

  const eventKey: string = "2023";
  const takeCount: number = 1;

  const qualCompLevels: string[] = ["qm"];
  const mostQualMatchPts = await getMatchData(
    eventKey,
    qualCompLevels,
    takeCount
  );

  const playoffCompLevels: string[] = ["sf", "f", "qf"];
  const mostPlayoffMatchPts = await getMatchData(
    eventKey,
    playoffCompLevels,
    takeCount
  );

  const awardNamesToCount: string[] = [
    "Winner",
    "Winners",
    "Impact Award",
    "Chairman's Award",
    "Woodie Flowers",
  ];

  const teamCounts: { [teamKey: string]: number } = {};

  for (const award of awards) {
    const recipients: any = award.recipient_list;

    if (
      recipients &&
      awardNamesToCount.some((name: string) => award.name.includes(name))
    ) {
      for (const recipient of recipients) {
        const teamKey = recipient.team_key;
        if (teamCounts[teamKey]) {
          teamCounts[teamKey]++;
        } else {
          teamCounts[teamKey] = 1;
        }
      }
    }
  }

  const sortedTeams: string[] = Object.keys(teamCounts).sort(
    (a: string, b: string) => teamCounts[b] - teamCounts[a]
  );

  const top10Teams: any[] = [];

  for (const teamKey of sortedTeams.slice(0, 11)) {
    if (teamKey !== "null") {
      const team: Team | null = await db.team.findUnique({
        where: {
          team_number: Number(teamKey.substring(3)),
        },
      });

      top10Teams.push({
        teamNumber: teamKey,
        name: team?.nickname,
        numAwards: teamCounts[teamKey],
      });
    }
  }

  return {
    props: {
      insights: insightsData,
      totalMatches,
      totalEvents,
      totalTeams,
      top10Teams,
      mostQualMatchPts,
      mostPlayoffMatchPts,
    },
  };
}
