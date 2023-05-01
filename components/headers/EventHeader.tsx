import { convertDate } from "@/util/date";
import { FaLink } from "react-icons/fa";
import { Social } from "../Social";

export const EventHeader = (props: any) => {
  const formattedDate = `${convertDate(props.event.start_date)} -
  ${convertDate(props.event.end_date)}, ${props.event.start_date.substring(
    0,
    4
  )}`;

  return (
    <div className="bg-gray-800 md:w-[1100px] rounded-lg py-12 px-12">
      <h1 className="text-3xl text-primary tetxt-left font-black">
        {props.event.name}
      </h1>
      <p className="text-gray-400 text-left">
        <span className="mb-[-22px] flex">
          {formattedDate}{" "}
          <span className="bg-gray-700 rounded-full py-[3.5px] ml-1 px-2 text-xs font-semibold">
            {props.event.week !== null
              ? `Week ${props.event.week + 1} (${props.teams.length} team${
                  props.teams.length > 1 && "s"
                })`
              : `${props.event.event_type_string} ${
                  props.teams.length > 0 &&
                  `(${props.teams.length} team${props.teams.length > 1 && "s"})`
                }`}
          </span>{" "}
        </span>
        <br />{" "}
        {props.event.location_name && (
          <a href={props.event.gmaps_url} target="_blank">
            {props.event.location_name},
          </a>
        )}{" "}
        {props.event.city}, {props.event.country} •{" "}
        {props.event.district && (
          <span>{props.event.district.display_name} District • </span>
        )}
        <a
          href={`https://frc-events.firstinspires.org/${props.event.year}/${props.event.event_code}`}
          target="_blank"
        >
          FIRST Inspires
        </a>
      </p>
      {props.event.website && props.event.website !== "N/A" && (
        <a href={props.event.website} target="_blank">
          <Social
            icon={FaLink}
            name={props.event.website.replace(".html", "")}
            className="text-white font-bold mt-3"
          />
        </a>
      )}
    </div>
  );
};
