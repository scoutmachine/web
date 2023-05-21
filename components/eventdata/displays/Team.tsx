import { epochSecondsToTime, formatEpochSecondsToDate } from "@/utils/time";
import Link from "next/link";
import { FaYoutube, FaTimes, FaTrophy } from "react-icons/fa";
import { newText } from "..";
import React, { JSX } from "react";

const RED_ALLIANCE_COLOR: "text-red-400" = "text-red-400";
const BLUE_ALLIANCE_COLOR: "text-sky-400" = "text-sky-400";
const RED_TEAM_COLOR: "text-black dark:text-white font-semibold" = "text-black dark:text-white font-semibold";
const BLUE_TEAM_COLOR: "text-sky-400" = "text-sky-400";
const DEFAULT_TEAM_COLOR: "text-lightGray" = "text-lightGray";

export const TeamDisplay = (props: any) => {
  const redScore: number = Number(props.match.alliances.red.score);
  const blueScore: number = Number(props.match.alliances.blue.score);

  const { alliance, team } = props.findAlliances();
  const allianceColour: "text-red-400" | "text-sky-400" =
    alliance === "Red" ? RED_ALLIANCE_COLOR : BLUE_ALLIANCE_COLOR;
  const opposingAllianceColour: "text-red-400" | "text-sky-400" =
    allianceColour === RED_ALLIANCE_COLOR
      ? BLUE_ALLIANCE_COLOR
      : RED_ALLIANCE_COLOR;

  const score: number = alliance === "Red" ? redScore : blueScore;
  const opposingTeamScore: number = score === redScore ? blueScore : redScore;
  const oppositeAlliance =
    alliance === "Red"
      ? props.match.alliances.blue.team_keys.map((team: any) =>
          team.replace("frc", "")
        )
      : props.match.alliances.red.team_keys.map((team: any) =>
          team.replace("frc", "")
        );

  const matchWinner = (): "Red" | "Blue" | "Tie" => {
    if (redScore > blueScore) {
      return "Red";
    } else if (blueScore > redScore) {
      return "Blue";
    }

    return "Tie";
  };

  const renderTeamLink = (team: string, isOpposing: boolean) => {
    const teamColor: "text-red-400" | "text-sky-400" = isOpposing
      ? opposingAllianceColour
      : allianceColour;
    const isDqTeam = props.match.alliances.red.dq_team_keys.includes(team);
    const isSurrogateTeam =
      props.match?.alliances?.red?.surrogate_team_keys.includes(team);

    return (
      <Link href={`/teams/${team}`}>
        <span
          className={`hover:text-primary ${teamColor} ${
            team === props.team && "text-black dark:text-white font-semibold"
          } ${isDqTeam ? "line-through text-red-400 hover:text-primary" : ""} ${
            isSurrogateTeam ? "underline decoration-dotted" : ""
          }`}
        >
          {team.match(/\d+/)}
          {isDqTeam && (
            <div className="bg-red-400 h-3 w-2 inline-block ml-1"></div>
          )}
        </span>
      </Link>
    );
  };

  const renderTeamList = (teams: string[], isOpposing: boolean) => {
    return teams.map((team: string, i: number) => (
      <React.Fragment key={team}>
        {i > 0 && <span className="text-lightGray">, </span>}
        {renderTeamLink(team, isOpposing)}
      </React.Fragment>
    ));
  };

  const renderMatchResult = (): JSX.Element => {
    if (alliance === matchWinner()) {
      return (
        <>
          <FaTrophy className="mr-1 inline-block text-primary" />
          <span className="text-green-400">Win</span>
        </>
      );
    } else {
      return <span className="text-red-400">Loss</span>;
    }
  };

  return (
    <tr className="text-lightGray border border-[#2A2A2A] bg-card hover:bg-[#191919]">
      <td className="px-6 py-4">
        {props.match.videos && props.match.videos.length > 0 ? (
          <a
            href={`https://www.youtube.com/watch?v=${props.match.videos[0].key}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaYoutube className="text-2xl text-red-400 hover:text-black dark:text-white" />
          </a>
        ) : (
          <p className="text-lightGray">
            <FaTimes className="text-2xl" />
          </p>
        )}
      </td>

      <th scope="row" className="px-6 py-4 whitespace-nowrap">
        <Link
          href={`/events/${props.match.key.replace("_", "/")}`}
          legacyBehavior
        >
          <a>
            <span
              className={`hover:text-primary ${
                props.didWeWin() === "win" && props.isTeam && "text-green-400"
              } ${
                props.didWeWin() === "lose" && props.isTeam && "text-red-400"
              } ${
                props.didWeWin() === "unknown" && props.isTeam
                  ? DEFAULT_TEAM_COLOR
                  : "text-black dark:text-white"
              }`}
            >
              {props.search_array(newText, props.match.comp_level)}{" "}
              {props.match.comp_level !== "qm"
                ? `${props.match.set_number} (Match ${props.match.match_number})`
                : props.match.match_number}{" "}
              <br />
              {props.match.time && (
                <span className="text-lightGray text-sm font-medium">
                  {epochSecondsToTime(props.match.time)} •{" "}
                  {formatEpochSecondsToDate(props.match.time)}
                </span>
              )}
            </span>{" "}
          </a>
        </Link>
      </th>

      <td scope="row" className="px-6 py-4 whitespace-nowrap">
        <p className={allianceColour}>
          {renderTeamList(props.findAlliances().teams, false)}
        </p>
      </td>

      <td scope="row" className="px-6 py-4 whitespace-nowrap">
        {renderMatchResult()}
      </td>

      <td scope="row" className="px-6 py-4 whitespace-nowrap">
        {score}
      </td>

      <td scope="row" className="px-6 py-4 whitespace-nowrap">
        {renderTeamList(oppositeAlliance, true)}
      </td>

      <td scope="row" className="px-6 py-4 whitespace-nowrap">
        {opposingTeamScore}
      </td>
    </tr>
  );
};
