import { CURR_YEAR } from "@/lib/constants";
import Link from "next/link";
import { FaAward, FaBolt, FaGlobe, FaRocket, FaTrophy } from "react-icons/fa";

const Card = (props: any) => {
  return (
    <div className="px-5 py-5 rounded-lg border border-[#2A2A2A] bg-card">
      {props.children}
    </div>
  );
};

export const AboutTab = (props: any) => {
  const avgAwards = (
    props.team.teamAwards.length / props.team.yearsParticipated.length
  ).toFixed(1);

  const eventsWon = props.team.teamAwards.filter((award: any) =>
    award.name.includes("Winner")
  ).length;

  const district = props.team.teamDistrict.team;

  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-4 mt-5">
      <Card>
        <h1 className="text-white font-semibold">
          <FaRocket className="mr-1 inline-block" /> Team Number
        </h1>
        <p className="text-lightGray">{props.team.teamData.team_number}</p>
      </Card>
      <Card>
        <h1 className="text-white font-semibold">
          <FaGlobe className="mr-1 inline-block" /> District Rank
        </h1>
        <p className="text-lightGray">
          {district ? (
            <>
              <b>
                #{district.rank} in {district.districtCode}
              </b>{" "}
              ({district.totalPoints} ranking points) <br />{" "}
              {district.teamNumber} scored {district.event1Points}pts at{" "}
              <Link
                className="text-white hover:text-primary"
                href={`/events/${CURR_YEAR}${district.event1Code.toLowerCase()}`}
              >
                {district.event1Code}
              </Link>{" "}
              & {district.event2Points}pts at{" "}
              <Link
                className="text-white hover:text-primary"
                href={`/events/${CURR_YEAR}${district.event2Code.toLowerCase()}`}
              >
                {district.event2Code}
              </Link>{" "}
            </>
          ) : (
            "N/A"
          )}
        </p>
      </Card>
      <Card>
        <h1 className="text-white font-semibold">
          <FaBolt className="mr-1 inline-block" /> Seasons Completed
        </h1>
        <p className="text-lightGray">
          {props.team.yearsParticipated.length} seasons
        </p>
        <p className="text-lightGray flex-wrap text-sm">
          ({props.team.yearsParticipated.join(", ")})
        </p>
      </Card>
      <Card>
        <h1 className="text-white font-semibold">
          <FaTrophy className="mr-1 inline-block" /> Events Won
        </h1>
        <p className="text-lightGray">{eventsWon} events</p>
      </Card>
      <Card>
        <h1 className="text-white font-semibold">
          <FaAward className="mr-1 inline-block" /> Awards Won
        </h1>
        <p className="text-lightGray">{props.team.teamAwards.length} awards</p>
      </Card>
      <Card>
        <h1 className="text-white font-semibold">
          <FaAward className="mr-1 inline-block" /> Avg Awards / Season
        </h1>
        <p className="text-lightGray">{avgAwards} awards</p>
      </Card>
    </div>
  );
};
