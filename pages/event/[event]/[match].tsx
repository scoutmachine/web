import { Navbar } from "@/components/navbar";
import db from "@/lib/db";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { JSX } from "react";
import { Match } from "@prisma/client";
import { SEO } from "@/components/SEO";

export default function MatchPage({ match }: any): JSX.Element {
  const title: string = `Match ${match.match_number} / ${match.event_key
    .slice(4)
    .toUpperCase()} / Scout Machine`;

  return (
    <>
      <SEO title={title} />

      <Navbar />

      <div className="pr-4 pl-4 md:pr-8 md:pl-8 max-w-screen-3xl">
        <h1 className="text-white mt-5">Match {match.match_number}</h1>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<{
  props: { match: any };
}> => {
  const { event, match }: any = context.params;

  const matchData: Match | null = await db.match.findUnique({
    where: {
      key: `${event}_${match}`,
    },
  });

  return {
    props: {
      match: JSON.parse(
        JSON.stringify(matchData, (key: string, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
    },
  };
};
