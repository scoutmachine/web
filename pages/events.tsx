import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/navbar";
import { EventsScreen } from "@/components/screens/EventsScreen";
import { CURR_YEAR } from "@/lib/constants";
import { JSX, useState } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import db from "@/lib/db";
import { Event } from "@prisma/client";

export default function EventsPage({ events }: any): JSX.Element {
  const [year, setYear] = useState<number>(CURR_YEAR);
  const [allEvents, setAllEvents] = useState(events);

  return (
    <>
      <Head>
        <title>Events | Scout Machine</title>
      </Head>

      <Navbar active="Events" />

      <div className="flex flex-col items-center justify-center">
        <Header title="Events" desc={`${year} season`} />
        <EventsScreen
          events={events}
          setEvents={setAllEvents}
          year={year}
          setYear={setYear}
        />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: { events: any };
}> => {
  const events: Event[] = await db.event.findMany();
  const sortedEvents: Event[] = events.sort((a: any, b: any) =>
    a.start_date.localeCompare(b.start_date)
  );

  return { props: { events: sortedEvents } };
};
