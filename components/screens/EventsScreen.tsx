import { CURR_YEAR } from "@/lib/constants";
import { convertDate } from "@/util/date";
import Link from "next/link";

const Event = (props: any) => {
  return (
    <Link href={`/events/${props.event.key}`} legacyBehavior>
      <a>
        <div
          className={`${
            props.event.event_type_string === "Championship Division" &&
            "md:w-[310px] w-[430px]"
          } ${
            props.event.event_type_string === "Offseason" &&
            "md:w-full w-[430px]"
          } border dark:border-[#2A2A2A] dark:bg-card hover:border-gray-600 px-5 py-5 h-40 rounded-lg relative`}
        >
          <h1 className="font-bold text-xl text-gray-300">
            {props.event.name.length > 42
              ? `${props.event.name.slice(0, 42)}...`
              : props.event.name}
          </h1>
          <p className="text-gray-300">
            {convertDate(props.event.start_date)} -{" "}
            {convertDate(props.event.end_date)}, {CURR_YEAR}
          </p>
          <p className="text-lightGray absolute bottom-3 left-5">
            {props.event.city}, {props.event.state_prov}, {props.event.country}
          </p>
        </div>
      </a>
    </Link>
  );
};

export const EventsScreen = (props: any) => {
  const renderEventsSection = (filterCondition: any, title: string) => (
    <div className="text-left">
      <h1 className="pl-8 text-lightGray mt-10 mb-5 text-2xl">
        <span className="font-bold text-white">{title}</span> (
        {props.events.filter(filterCondition).length} events)
      </h1>
      <div className="pl-8 pr-8 flex items-center justify-center flex-col grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        {props.events.filter(filterCondition).map((event: any, key: number) => {
          return <Event key={key} event={event} />;
        })}
      </div>
    </div>
  );

  return (
    <>
      {renderEventsSection(
        (event: any) => event.event_type_string === "Preseason",
        "Preseason"
      )}

      {renderEventsSection((event: any) => event.week === 0, "Week 1")}
      {renderEventsSection((event: any) => event.week === 1, "Week 2")}
      {renderEventsSection((event: any) => event.week === 2, "Week 3")}
      {renderEventsSection((event: any) => event.week === 3, "Week 4")}
      {renderEventsSection((event: any) => event.week === 4, "Week 5")}
      {renderEventsSection((event: any) => event.week === 5, "Week 6")}

      {renderEventsSection(
        (event: any) => event.event_type_string === "Championship Division",
        "FIRST Championship - Houston, TX"
      )}

      {renderEventsSection(
        (event: any) => event.event_type_string === "Offseason",
        "Offseason"
      )}
    </>
  );
};
