import { Loading } from "@/components/Loading";
import { Navbar } from "@/components/Navbar";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { getStorage, setStorage } from "@/util/localStorage";
import { log } from "@/util/log";
import { formatTime } from "@/util/time";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

async function fetchMatchData(event: string, match: string) {
  const teamData = getStorage(`event_${event}_match_${match}_${CURR_YEAR}`);

  if (teamData) {
    return teamData;
  }

  const start = performance.now();

  const res = await fetch(
    `${API_URL}/api/events/match?match=${event}_${match}`
  );

  if (!res.ok) return undefined;

  log(
    "warning",
    `Fetching [/events/match] took ${formatTime(performance.now() - start)}`
  );

  const data = await res.json();

  setStorage(`event_${event}_match_${match}_${CURR_YEAR}`, data);
  return data;
}

export default function MatchPage() {
  const [matchData, setMatchData] = useState<any>();
  const router = useRouter();
  const { event, match } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      const data = await fetchMatchData(event as string, match as string);
      if (data) setMatchData(data);
    };

    fetchData();
  }, [event, match, router.isReady]);

  if (!matchData) return <Loading />;

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
