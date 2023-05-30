import { useState } from "react";
import { Navbar } from "@/components/navbar";
import db from "@/lib/db";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { JSX } from "react";
import { Match, FormQuestion } from "@prisma/client";
import { MatchScout } from "./MatchScout";

export default function MatchPage({
  match,
  form,
}: {
  match: any;
  form: FormQuestion[];
}): JSX.Element {
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
    undefined
  );

  const title: string = `Match ${match.match_number} / ${match.event_key
    .slice(4)
    .toUpperCase()} | Scout Machine`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Navbar />

      <div className="pr-4 pl-4 md:pr-8 md:pl-8 max-w-screen-3xl">
        <h1 className="text-white mt-5">Match {match.match_number}</h1>
        {selectedTeam ? (
          <h2 className="text-white mt-2">Scouting for: {selectedTeam}</h2>
        ) : null}
        <div className="flex items-center justify-center gap-2">
          {match.alliances.red.team_keys.map((team: string) => (
            <div
              key={team}
              className={`bg-red-400 p-2 w-20 text-center rounded-lg`}
              onClick={() => {
                setSelectedTeam(team);
              }}
            >
              {team}
            </div>
          ))}
          {match.alliances.blue.team_keys.map((team: string) => (
            <div
              key={team}
              className={`bg-blue-400 p-2 w-20 text-center rounded-lg`}
              onClick={() => {
                setSelectedTeam(team);
              }}
            >
              {team}
            </div>
          ))}
        </div>
      </div>
      {form ? <MatchScout questions={form} /> : null}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<{
  props: { match: any; form: FormQuestion[] };
}> => {
  const { event, match }: any = context.params;

  const matchData: Match | null = await db.match.findUnique({
    where: {
      key: `${event}_${match}`,
    },
  });

  // TODO: Change when we have multiple forms
  const form = await db.formQuestion.findMany({
    where: {
      formId: 1,
    },
  });

  return {
    props: {
      form,
      match: JSON.parse(
        JSON.stringify(matchData, (key: string, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
    },
  };
};
