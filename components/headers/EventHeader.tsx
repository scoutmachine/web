import { convertDate } from "@/utils/date";
import { FaLink } from "react-icons/fa";
import { Social } from "../Social";

export const EventHeader = (props: any) => {
  const formattedDate: string = `${convertDate(props.event.start_date)} -
  ${convertDate(props.event.end_date)}, ${props.event.start_date.substring(
    0,
    4
  )}`;

  return (
    <div className="pr-4 pl-4 md:pr-0 md:pl-0 w-full max-w-screen-3xl">
      <div className="border border-[#2a2a2a] bg-[#191919] rounded-lg px-10 py-10 flex flex-col">
        <h1 className="text-3xl text-primary tetxt-left font-black">
          {props.event.name}
        </h1>
        <p className="text-lightGray text-left">
          <span className="mb-[-22px] flex">
            {formattedDate}{" "}
            <span className="border border-[#2A2A2A] text-lightGray rounded-full py-[3.5px] ml-1 px-2 text-xs font-semibold">
              {props.event.event_type_string !== "Offseason"
                ? props.event.week !== null
                  ? `Week ${props.event.week + 1} (${props.teams.length} team${
                      props.teams.length > 1 && "s"
                    })`
                  : `${props.event.event_type_string} ${
                      props.teams.length > 0 &&
                      `(${props.teams.length} ${
                        props.teams.length === 1 ? "team" : "teams"
                      })`
                    }`
                : "Offseason"}
            </span>
          </span>
          <br />{" "}
          {props.event.location_name && (
            <a
              href={props.event.gmaps_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.event.location_name},
            </a>
          )}{" "}
          {props.event.city}, {props.event.country} •{" "}
          {props.event.district && (
            <span>{props.event.district.display_name} District • </span>
          )}
          <a
            href={`https://frc-events.firstinspires.org/${props.event.year}/${props.event.event_code}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            FIRST Inspires
          </a>
        </p>
        {props.event.website && props.event.website !== "N/A" && (
          <a
            href={props.event.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Social
              icon={FaLink}
              name={props.event.website.replace(".html", "")}
              className="text-black dark:text-white font-bold mt-3"
            />
          </a>
        )}
      </div>
    </div>
  );
};
