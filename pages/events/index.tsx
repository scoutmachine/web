import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { API_URL } from "@/lib/constants";
import { convertDate } from "@/util/date";
import { GetServerSideProps } from "next";

const Event = (props: any) => {
  return (
    <a
      href={`${
        props.event.first_event_code
          ? `https://frc-events.firstinspires.org/2023/${props.event.first_event_code}`
          : props.event.website
      }`}
      target="_blank"
    >
      <div className="bg-gray-700 hover:bg-gray-600 px-5 py-5 h-40 md:w-[300px] w-[350px] rounded-lg border-2 border-gray-500 relative">
        <h1 className="font-black text-xl">
          {props.event.name.length > 42
            ? `${props.event.name.slice(0, 42)}...`
            : props.event.name}
        </h1>
        <p className="text-gray-300">
          {convertDate(props.event.start_date)} -{" "}
          {convertDate(props.event.end_date)}, 2023
        </p>
        <p className="text-gray-400 absolute bottom-3 left-5">
          {props.event.city}, {props.event.country}
        </p>
      </div>
    </a>
  );
};

const Title = (props: any) => {
  return (
    <h1 className=" text-gray-400 mt-10 mb-5 text-2xl">
      <span className="font-black text-primary">{props.title}</span> (
      {props.children} events)
    </h1>
  );
};

export default function Events({ events }: any) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Header title="2023 Events ─ Scouting Machine" />

      <Title title="Preseason">
        {
          events.filter((event: any) => event.event_type_string === "Preseason")
            .length
        }
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {events
          .filter((event: any) => event.event_type_string === "Preseason")
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 1">
        {events.filter((event: any) => event.week === 0).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {events
          .filter((event: any) => event.week === 0)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 2">
        {events.filter((event: any) => event.week === 1).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {events
          .filter((event: any) => event.week === 1)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 3">
        {events.filter((event: any) => event.week === 2).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {events
          .filter((event: any) => event.week === 2)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 4">
        {events.filter((event: any) => event.week === 3).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {events
          .filter((event: any) => event.week === 3)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 5">
        {events.filter((event: any) => event.week === 4).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {events
          .filter((event: any) => event.week === 4)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 6">
        {events.filter((event: any) => event.week === 5).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {events
          .filter((event: any) => event.week === 5)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="FIRST Championship - Houston, TX">
        {
          events.filter(
            (event: any) => event.event_type_string === "Championship Division"
          ).length
        }
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {events
          .filter(
            (event: any) => event.event_type_string === "Championship Division"
          )
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Offseason">
        {
          events.filter((event: any) => event.event_type_string === "Offseason")
            .length
        }
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center md:flex-row flex-col gap-5">
        {events
          .filter((event: any) => event.event_type_string === "Offseason")
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Footer />
    </div>
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
