import { GetServerSideProps, GetServerSidePropsContext } from "next";
import db from "@/lib/db";
import { Match } from "@prisma/client";

export default function LiveFieldViewPage({ teamMatches }: any) {
  console.log(teamMatches);

  return <h1>Testing</h1>;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<{ props: any }> => {
  const { team }: any = context.params;

  const teamMatches = await db.match.findMany({
    where: {
      event_key: {
        contains: "2023",
      },
      OR: [
        {
          alliances: {
            path: ["red", "team_keys"],
            array_contains: `frc${team}`,
          },
        },
        {
          alliances: {
            path: ["blue", "team_keys"],
            array_contains: `frc${team}`,
          },
        },
      ],
    },
  });

  const highestScoringMatches: Match[] = teamMatches
    .sort((a: any, b: any) => {
      const scoreA = a.alliances.red.score + a.alliances.blue.score;
      const scoreB = b.alliances.red.score + b.alliances.blue.score;
      return scoreB - scoreA;
    })
    .slice(0, 2);

  return {
    props: {
      teamMatches: JSON.parse(
        JSON.stringify(
          highestScoringMatches,
          (key: string, value) =>
            typeof value === "bigint" ? value.toString() : value // return everything else unchanged
        )
      ),
    },
  };
};
