import { Loading } from "@/components/Loading";
import { Navbar } from "@/components/navbar";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { getStorage, setStorage } from "@/utils/localStorage";
import { log } from "@/utils/log";
import { formatTime } from "@/utils/time";
import Head from "next/head";
import {useRouter} from "next/router";
import {useState, useEffect, JSX} from "react";

async function fetchMatchData(event: string, match: string): Promise<any> {
  const teamData = getStorage(`event_${event}_match_${match}_${CURR_YEAR}`);

  if (teamData) {
    return teamData;
  }

  const start: number = performance.now();

  const res: Response = await fetch(
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

export default function MatchPage(): JSX.Element {
  const [matchData, setMatchData] = useState<any>();
  const router = useRouter();
  const {event, match} = router.query;

  useEffect((): void => {
    if (!router.isReady) return;

    const fetchData = async (): Promise<any> => {
      const data = await fetchMatchData(event as string, match as string);
      if (data) setMatchData(data);
    };

    fetchData();
  }, [event, match, router.isReady]);

  if (!matchData) return <Loading />;

  return (
    <>
      <Head>
        <title>Match {matchData.match_number} | Scout Machine</title>
      </Head>

      <Navbar />

      <h1>{matchData.match_number}</h1>
    </>
  );
}
