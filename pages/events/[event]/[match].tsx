import { Navbar } from "@/components/navbar";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { JSX } from "react";

export default function MatchPage({
  match,
}: InferGetServerSidePropsType<GetServerSideProps>): JSX.Element {
  const title = `Match ${match.match_number} / ${match.event_key
    .slice(4)
    .toUpperCase()} | Scout Machine`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Navbar />

      <div className="pl-4 pr-4 md:pr-8 md:pl-8 max-w-screen-3xl">
        <h1 className="mt-5 text-white">Match {match.match_number}</h1>
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
