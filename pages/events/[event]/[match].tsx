import { Navbar } from "@/components/Navbar";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import Head from 'next/head'

export default function MatchPage({ matchData }: any) {
  return (
    <>
      <Head>
        <title>Match | Scout Machine</title>
      </Head>

      <Navbar />

      <h1>{matchData.match_number}</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { match, event } = context.query;

  const matchData = await fetch(
    `${API_URL}/api/events/match?match=${event}_${match}`
  ).then((res) => res.json());

  return {
    props: {
      matchData,
    },
  };
};
