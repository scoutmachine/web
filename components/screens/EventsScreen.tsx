import { CURR_YEAR } from "@/lib/constants";
import { convertDate } from "@/utils/date";
import Link from "next/link";

const Event = (props: any) => {
  return (
    <Link href={`/events/${props.event.key}`} legacyBehavior>
      <a>
        <div className={`border border-[#2A2A2A] bg-card hover:border-gray-600 px-5 py-5 h-40 rounded-lg relative w-full`}>
          <h1 className="font-bold text-xl text-white text-left">
            {props.event.name.length > 42 ? `${props.event.name.slice(0, 42)}...` : props.event.name}
          </h1>
          <p className="text-lightGray">
            {convertDate(props.event.start_date)} - {convertDate(props.event.end_date)}, {CURR_YEAR}
          </p>
          <p className="text-lightGray absolute bottom-3 left-5 md:text-left text-left">
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
        <span className="font-bold text-white">{title} Events</span> (
        {props.events.filter(filterCondition).length})
      </h1>
      <div className="pr-4 pl-4 md:pl-8 md:pr-8 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        {props.events.filter(filterCondition).map((event: any, key: number) => {
          return <Event key={key} event={event} />;
        })}
      </div>
    </div>
  );

  const today = new Date();
  const newToday = today.toISOString().split("T")[0];

  today.setHours(0, 0, 0, 0);

  return (
    <div className="max-w-screen-3xl">
      {renderEventsSection(
        (event: any) => newToday <= event.end_date,
        "Upcoming"
      )}
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
    </div>
  );
};
