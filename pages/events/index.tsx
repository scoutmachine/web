import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import { EventsScreen } from "@/components/screens/EventsScreen";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";

export default function Events({ events }: any) {
  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center">
        <Header title="2023 Events ─ Scouting Machine" />
        <EventsScreen events={events} />
        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await fetch(`${API_URL}/api/events/all`).then((res) =>
    res.json()
  );

  events.sort((a: any, b: any) => {
    if (a.start_date < b.start_date) {
      return -1;
    } else if (a.start_date > b.start_date) {
      return 1;
    } else {
      return 0;
    }
  });

  return {
    props: {
      events,
    },
  };
};
