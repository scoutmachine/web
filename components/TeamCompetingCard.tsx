/* eslint-disable @next/next/no-img-element */

import { epochSecondsToTime } from "@/utils/time";
import { FaTwitch } from "react-icons/fa";

export const TeamCompetingCard = (props: {
  team: any;
  favourite: any;
  avatars: any;
}) => {
  const toEpochSeconds: number = new Date(
    props.team.match?.startTime
  ).getTime();

  const channel = props.team.event?.webcasts?.reduce(
    (acc: string, item: any) => {
      return item.channel.length > acc.length ? item.channel : acc;
    },
    ""
  );

  return (
    <a href={`/teams/${props.favourite.team_number}/next`} target="_blank">
      <div className="relative px-5 py-5 h-32 border bg-white border-solid dark:border-[#2A2A2A] dark:bg-card dark:hover:border-gray-600 rounded-lg">
        <a href={`https://twitch.tv/${channel}`} target="_blank">
          <FaTwitch className="absolute top-6 right-5 text-purple-400 hover:text-purple-500" />
        </a>

        <div className="flex">
          <img
            src={
              props.avatars[props.favourite.team_number]
                ? `data:image/jpeg;base64,${
                    props.avatars[props.favourite.team_number]
                  }`
                : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
                    props.favourite.website?.startsWith("https")
                      ? props.favourite.website
                      : `https://${props.favourite.website?.slice(7)}`
                  }/&size=64`
            }
            className="h-6 w-6 mr-2"
            alt="test"
          />

          <h1 className="text-white font-bold">
            {props.favourite.team_number} | {props.favourite.nickname}
          </h1>
        </div>

        <p className="text-lightGray text-sm mt-2">
          Up next in{" "}
          <b className="text-white">{props.team.match.description}</b> at{" "}
          {props.team.event.name}, Team {props.favourite.team_number} is
          estimated to compete around{" "}
          <b className="text-white">
            {epochSecondsToTime(toEpochSeconds, true)}
          </b>
          .
        </p>
      </div>
    </a>
  );
};
