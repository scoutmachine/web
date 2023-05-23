import { Navbar } from "@/components/navbar";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { JSX } from "react";

export default function MatchPage({ match }: any): JSX.Element {
  return (
    <>
      <Head>
        <title>
          Match {match.match_number} / {match.event_key.slice(4).toUpperCase()}{" "}
          | Scout Machine
        </title>
      </Head>

      <Navbar />

      <div className="pr-4 pl-4 md:pr-8 md:pl-8 max-w-screen-3xl">
        <h1 className="text-white mt-5">Match {match.match_number}</h1>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{
  props: { match: any };
}> => {
  const { event, match }: any = context.params;

  const matchData = await fetch(
    `${API_URL}/api/v2/event/match?match=${event}_${match}`
  ).then((res) => res.json());

  return { props: { match: matchData } };
};
