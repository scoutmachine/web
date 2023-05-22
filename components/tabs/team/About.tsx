import { searchDistrict } from "@/components/screens/TeamScreen";
import { CURR_YEAR } from "@/lib/constants";
import { districtCodeToName } from "@/lib/lists/districts";
import Link from "next/link";
import {
  FaAward,
  FaBolt,
  FaGlobe,
  FaMapMarkedAlt,
  FaPlane,
  FaRocket,
  FaTrophy,
} from "react-icons/fa";

const Card = (props: any) => {
  return (
    <div className="px-5 py-5 rounded-lg border border-[#2A2A2A] hover:border-gray-600 bg-card">
      {props.children}
    </div>
  );
};

function countUniqueChampionshipTeams(events: any): number {
  const championshipEvents = events?.filter((event: any) =>
    event.event_type_string.includes("Championship")
  );

  const uniqueEvents: Set<string> = new Set<string>();

  championshipEvents?.forEach((event: any): void => {
    const eventName = event.name.toLowerCase();
    const eventCode = event.event_code.toLowerCase();
    const keywords: string[] = [
      "arc",
      "cur",
      "gal",
      "dal",
      "hop",
      "john",
      "mil",
      "new",
      "tes",
      "cars",
    ];

    if (
      ["Championship Division", "Championship Finals"].includes(
        event.event_type_string
      ) ||
      keywords.some((keyword: string) => eventCode.includes(keyword))
    ) {
      const teamMatch = eventName.match(/\d+/) || eventCode.match(/\d+/);
      if (teamMatch) {
        uniqueEvents.add(teamMatch[0]);
      }
    }
  });

  return uniqueEvents.size;
}

export const AboutTab = (props: any) => {
  const avgAwards: string = (
    props.team?.teamAwards?.length / props.team?.yearsParticipated?.length
  ).toFixed(1);

  const avgEvents: string = (
    props.team?.teamEvents?.length / props.team?.yearsParticipated?.length
  ).toFixed(1);

  const avgAwardsPerEvent: string = (
    props.team?.teamAwards?.length / props.team?.teamEvents?.length
  ).toFixed(1);

  const eventsWon = props.team?.teamAwards?.filter((award: any) =>
    award.name.includes("Winner")
  ).length;

  const district = props.team?.teamDistrict?.team;
  const districtPercentage: number = Math.trunc(
    (100 * district?.rank) / props.team?.teamDistrict?.total
  );
  const roundedPercentage: number = Math.round(districtPercentage / 10) * 10;

  const tripsToChampionship: number = countUniqueChampionshipTeams(
    props.team?.teamEvents
  );

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-4 mt-5">
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaRocket className="mr-1 inline-block" /> General Info
        </h1>
        <p className="text-lightGray">
          {props.team?.teamData?.team_number} | {props.team?.teamData?.nickname}
        </p>

        {district && (
          <>
            <p className="text-lightGray text-sm mt-2">
              <b className="text-black dark:text-white">
                Qualified for District Championship:
              </b>{" "}
              {props.team?.teamDistrict.team.qualifiedDistrictCmp
                ? "Yes"
                : "No"}
            </p>
            <p className="text-lightGray text-sm">
              <b className="text-black dark:text-white">
                Qualified for <i>FIRST</i> Championship:
              </b>{" "}
              {props.team?.teamDistrict.team.qualifiedFirstCmp ? "Yes" : "No"}
            </p>
          </>
        )}
      </Card>
      <Card>
        <div className="relative">
          {roundedPercentage >= 0 && roundedPercentage < 50 && (
            <span
              className={`top-0 right-0 absolute text-green-800 bg-green-400 py-1 px-2 rounded-lg text-xs`}
            >
              top {districtPercentage === 0 ? 1 : roundedPercentage}%
            </span>
          )}
          <h1 className="text-black dark:text-white font-semibold">
            <FaGlobe className="mr-1 inline-block" /> District Rank
          </h1>
          <p className="text-lightGray">
            {district ? (
              <>
                <b
                  className={`${district.rank === 1 && "text-primary"} ${
                    district.rank === 2 && "text-[#C0C0C0]"
                  } ${district.rank === 3 && "text-[#CD7F32]"}`}
                >
                  #{district.rank} in{" "}
                  {searchDistrict(districtCodeToName, district.districtCode)} (
                  {district.districtCode}, {props.team?.teamDistrict.total}{" "}
                  teams)
                </b>{" "}
                <br />
                {district.teamNumber} scored {district.totalPoints} ranking
                points{" "}
                {district?.event1Code && (
                  <span>
                    & {district?.event1Points}pts at{" "}
                    <Link
                      className="text-black dark:text-white hover:text-primary"
                      href={`/events/${CURR_YEAR}${district?.event1Code?.toLowerCase()}`}
                    >
                      {district?.event1Code}
                    </Link>{" "}
                  </span>
                )}
                {district?.event2Code && (
                  <span>
                    & {district?.event2Points}pts at{" "}
                    <Link
                      className="text-black dark:text-white hover:text-primary"
                      href={`/events/${CURR_YEAR}${district?.event2Code?.toLowerCase()}`}
                    >
                      {district?.event2Code}
                    </Link>
                  </span>
                )}
              </>
            ) : (
              "N/A"
            )}
          </p>
        </div>
      </Card>
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaBolt className="mr-1 inline-block" /> Seasons Completed
        </h1>
        <p className="text-lightGray">
          {props.team?.yearsParticipated?.length} seasons
        </p>
        <p className="text-lightGray flex-wrap text-sm">
          ({props.team?.yearsParticipated?.join(", ")})
        </p>
      </Card>
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaMapMarkedAlt className="mr-1 inline-block" /> Events Completed
        </h1>
        <p className="text-lightGray">
          {props.team?.teamEvents?.length}{" "}
          {props.team?.teamEvents?.length === 1 ? "event" : "events"}
        </p>
      </Card>
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaMapMarkedAlt className="mr-1 inline-block" /> Avg Events per Season
        </h1>
        <p className="text-lightGray">{avgEvents} events</p>
      </Card>
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaTrophy className="mr-1 inline-block" /> Events Won
        </h1>
        <p className="text-lightGray">{eventsWon} events</p>
      </Card>
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaAward className="mr-1 inline-block" /> Awards Won
        </h1>
        <p className="text-lightGray">
          {props.team?.teamAwards?.length} awards
        </p>
      </Card>
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaAward className="mr-1 inline-block" /> Avg Awards per Season
        </h1>
        <p className="text-lightGray">{avgAwards} awards</p>
      </Card>
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaAward className="mr-1 inline-block" /> Avg Awards per Event
        </h1>
        <p className="text-lightGray">{avgAwardsPerEvent} awards</p>
      </Card>
      <Card>
        <h1 className="text-black dark:text-white font-semibold">
          <FaPlane className="mr-1 inline-block" /> Trips to <i>FIRST</i>{" "}
          Championship
        </h1>
        <p className="text-lightGray">
          {tripsToChampionship} {tripsToChampionship === 1 ? "trip" : "trips"}
        </p>
      </Card>
    </div>
  );
};
