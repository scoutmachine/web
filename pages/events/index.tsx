import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Navbar } from "@/components/Navbar";
import { EventsScreen } from "@/components/headers/EventsScreen";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { getStorage, setStorage } from "@/util/localStorage";
import { formatTime } from "@/util/time";
import { log } from "@/util/log";
import { useState, useEffect } from "react";
import Head from 'next/head'

async function fetchEventsData() {
  const eventsData = getStorage(`events_${CURR_YEAR}`);
  
  if (eventsData) {
    return eventsData;
  }

  const start = performance.now();
  const res = await fetch(`${API_URL}/api/events/all`, {
    next: { revalidate: 60 },
  });

  log("warning", `Fetching [/events/all] took ${formatTime(performance.now() - start)}`);

  if (!res.ok) {
    return undefined;
  }

  const data = await res.json();
  data.sort((a: any, b: any) => a.start_date.localeCompare(b.start_date));

  setStorage(`events_${CURR_YEAR}`, data);
  return data;
}

export default function EventsPage() {
  const [events, setEvents] = useState();

  useEffect(() => {
    async function fetchData() {
      const data = await fetchEventsData();
      if (data) setEvents(data);
    }
    fetchData();
  }, []);

  if (!events) return <Loading />;

  return (
    <>
      <Head>
        <title>Events | Scout Machine</title>
      </Head>

      <Navbar />

      <div className="flex flex-col items-center justify-center">
        <Header title="Events" desc="2023 Season" />
        <EventsScreen events={events} />
        <Footer />
      </div>
    </>
  );
}
