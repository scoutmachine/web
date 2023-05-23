import { Navbar } from "@/components/navbar";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { JSX } from "react";

export default function MatchPage({ match }: any): JSX.Element {
  return (
    <>
      <Head>
        <title>Match {match.match_number} | Scout Machine</title>
      </Head>

      <Navbar />

      <h1>{match.match_number}</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{
  props: { match: any };
}> => {
  const { event, match }: any = context.params;

  const matchData = await db.match.findFirst({
    where: {
      key: `${event}_${match}`,
    },
  });

  return { props: { match: matchData } };
};
