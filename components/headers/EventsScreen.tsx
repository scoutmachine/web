import { convertDate } from "@/util/date";
import Link from "next/link";

const Event = (props: any) => {
  return (
    <Link href={`/events/${props.event.key}`} legacyBehavior>
      <a>
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
    </Link>
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
export const EventsScreen = (props: any) => {
  return (
    <>
      <Title title="Preseason">
        {
          props.events.filter(
            (event: any) => props.event.event_type_string === "Preseason"
          ).length
        }
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {props.events
          .filter((event: any) => props.event.event_type_string === "Preseason")
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 1">
        {props.events.filter((event: any) => props.event.week === 0).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {props.events
          .filter((event: any) => props.event.week === 0)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 2">
        {props.events.filter((event: any) => props.event.week === 1).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {props.events
          .filter((event: any) => props.event.week === 1)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 3">
        {props.events.filter((event: any) => props.event.week === 2).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {props.events
          .filter((event: any) => props.event.week === 2)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 4">
        {props.events.filter((event: any) => props.event.week === 3).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {props.events
          .filter((event: any) => props.event.week === 3)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 5">
        {props.events.filter((event: any) => props.event.week === 4).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {props.events
          .filter((event: any) => props.event.week === 4)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Week 6">
        {props.events.filter((event: any) => props.event.week === 5).length}
      </Title>
      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {props.event
          .filter((event: any) => props.event.week === 5)
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="FIRST Championship - Houston, TX">
        {
          props.event.filter(
            (event: any) =>
              props.event.event_type_string === "Championship Division"
          ).length
        }
      </Title>

      <div className="md:pl-32 md:pr-32 flex items-center justify-center flex-col md:grid md:grid-cols-4 gap-3">
        {props.event
          .filter(
            (event: any) =>
              props.event.event_type_string === "Championship Division"
          )
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>

      <Title title="Offseason">
        {
          props.event.filter(
            (event: any) => props.event.event_type_string === "Offseason"
          ).length
        }
      </Title>

      <div className="md:pl-32 md:pr-32 flex items-center justify-center md:flex-row flex-col gap-5">
        {props.event
          .filter((event: any) => props.event.event_type_string === "Offseason")
          .map((event: any, key: number) => {
            return <Event key={key} event={event} />;
          })}
      </div>
    </>
  );
};
