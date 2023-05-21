import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { API_URL } from "@/lib/constants";
import {
  epochSecondsToTime,
  formatEpochSecondsToDate,
  formatRelativeTime,
} from "@/utils/time";
import { GetServerSideProps } from "next";
import { FaUndo } from "react-icons/fa";
import { GoPrimitiveDot } from "react-icons/go";

export default function NextTeamMatch({ next }: any) {
  const toEpochSeconds = new Date(next.match.startTime).getTime();
  const redAlliance = next.match.teams.filter((team: any) =>
    team.station.includes("Red")
  );
  const blueAlliance = next.match.teams.filter((team: any) =>
    team.station.includes("Blue")
  );

  const isTimeInPast = (time: string): boolean => {
    const currentTime: Date = new Date();
    const targetTime: Date = new Date(time);
    return targetTime < currentTime;
  };

  return (
    <>
      <Navbar />

      <div className="pl-4 pr-4 md:pr-8 md:pl-8 max-w-screen-3xl mt-10">
        <div className="bg-card mb-5 p-5 rounded-lg border dark:border-[#2A2A2A]">
          <p className="text-lightGray text-center">
            {epochSecondsToTime(toEpochSeconds, true)} •{" "}
            {formatEpochSecondsToDate(toEpochSeconds, true)} •{" "}
            {next.match.tournamentLevel} Match
          </p>
          <h1 className="text-black dark:text-white text-2xl text-center">
            <b>Upcoming:</b> {next.match.description} on {next.match.field}{" "}
            Field
          </h1>
          <p className="text-lightGray text-center">
            {next.event.name} at{" "}
            <b>
              {next.event.location_name}, {next.event.state_prov},{" "}
              {next.event.city}, {next.event.country}
            </b>
          </p>

          <div className="flex flex-row gap-3 items-center justify-center">
            {isTimeInPast(next.match.startTime) && (
              <span className="text-sm flex mt-3 bg-[#191919] border dark:border-[#2A2A2A] text-center text-green-400 py-2 px-5 rounded-lg">
                <GoPrimitiveDot className="mr-1 text-xl" /> Match Completed{" "}
                {formatRelativeTime(next.match.startTime)}
              </span>
            )}
            <span className="text-sm flex mt-3 bg-[#191919] border dark:border-[#2A2A2A] text-center text-yellow-400 py-2 px-5 rounded-lg">
              <FaUndo className="mr-2 text-xs mt-[4px]" /> Last Match:{" "}
              {next.previous.description}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
          <div className="bg-red-500 rounded-md p-5">
            <h1 className="text-3xl font-bold mb-4 text-red-200 text-center">
              Red Alliance
            </h1>

            <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
              {redAlliance.map((team: any, key: number) => {
                return (
                  <div key={key} className="bg-red-400 rounded-lg py-5">
                    <h1
                      className={`text-xl ${
                        team.surrogate ? "text-lightGray" : "text-white"
                      } font-bold text-center`}
                    >
                      Team {team.teamNumber}
                    </h1>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-sky-500 rounded-md p-5">
            <h1 className="text-3xl font-bold mb-4 text-sky-200 text-center">
              Blue Alliance
            </h1>

            <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
              {blueAlliance.map((team: any, key: number) => {
                return (
                  <div key={key} className="bg-sky-400 rounded-lg py-5">
                    <h1 className="text-xl text-white font-bold text-center">
                      Team {team.teamNumber}
                    </h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { team }: any = context.params;

  const nextMatch = await fetch(`${API_URL}/api/team/next?team=${team}`).then(
    (res) => res.json()
  );

  return { props: { next: nextMatch } };
};
