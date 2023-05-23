import { epochSecondsToTime, formatEpochSecondsToDate } from "@/utils/time";
import Link from "next/link";
import { FaYoutube, FaTimes, FaTrophy } from "react-icons/fa";
import { newText } from "..";

export const EventDisplay = (props: any) => {
  // const json =
  //   props.epas && props.epas[props.match.key]
  //     ? JSON.parse(JSON.stringify(props.epas[props.match.key]))
  //     : "";

  const redScore: number = Number(props.match.alliances.red.score);
  const blueScore: number = Number(props.match.alliances.blue.score);

  const matchWinner = (): string => {
    if (redScore > blueScore) {
      return "Red";
    } else if (blueScore > redScore) {
      return "Blue";
    } else if (blueScore === redScore) {
      return "Tie";
    }
    return "Unknown";
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
            <FaYoutube className="text-2xl text-red-400 hover:text-white" />
          </a>
        ) : (
          <p className="text-lightGray">
            <FaTimes className="text-2xl" />
          </p>
        )}
      </td>

      <th scope="row" className={`px-6 py-4 whitespace-nowrap`}>
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
                  ? "text-lightGray"
                  : "text-white"
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

      <td className="px-6 py-4">
        {matchWinner() === "Red" || matchWinner() === "Tie" ? (
          <FaTrophy className="mr-1 inline-block text-primary" />
        ) : null}{" "}
        <span className="text-red-400">{props.match.alliances.red.score}</span>{" "}
        -{" "}
        <span className="text-sky-400">{props.match.alliances.blue.score}</span>{" "}
        {matchWinner() === "Blue" || matchWinner() === "Tie" ? (
          <FaTrophy className="ml-1 inline-block text-primary" />
        ) : null}
      </td>

      <td
        className={`px-6 py-4 ${
          props.match.winning_alliance === "red"
            ? "text-green-400"
            : "text-lightGray"
        }`}
      >
        <p className="text-white font-bold mb-1">
          {props.match.alliances.red.score ?? "?"}{" "}
          {props.match.alliances.red.score === 0 && (
            <div className="bg-red-400 h-3 w-2 inline-block"></div>
          )}
          {/* <span className="border border-[#2A2A2A] text-xs text-lightGray py-[2px] px-2 ml-1 rounded-full">
            {json.redEPA} EPA
          </span>{" "} */}
          <br />
          {/* {redScore || redScore != undefined || !Number.isNaN(redScore) ? (
            <p className="text-xs text-lightGray mt-1">
              {redScore - json.redEPA > 0 ? (
                <span className="text-green-400">
                  +{(redScore - json.redEPA).toFixed(1)}pts
                </span>
              ) : (
                <span className="text-red-400">
                  {(redScore - json.redEPA).toFixed(1)}pts
                </span>
              )}{" "}
              •{" "}
              {redScore && json.redEPA && redScore - json.redEPA > 0
                ? "OUTPERFORMED"
                : "UNDERPERFORMED"}
            </p>
          ) : (
            ""
          )} */}
        </p>

        <span className="font-regular">
          (
          {props.match.alliances.red.team_keys.includes("frc0")
            ? "TBD"
            : props.match.alliances.red.team_keys.map(
                (team: any, i: number) => (
                  <>
                    {i > 0 && ", "}
                    <Link href={`/teams/${team.substring(3)}`}>
                      <span
                        className={`hover:text-primary ${
                          team.substring(3) === props.team &&
                          "text-white font-semibold"
                        }`}
                      >
                        <span
                          className={`${
                            props.match.alliances.red.dq_team_keys.includes(
                              team
                            ) && "line-through text-red-400 hover:text-primary"
                          } ${
                            props.match?.alliances?.red?.surrogate_team_keys.includes(
                              team
                            ) && "underline decoration-dotted"
                          }`}
                        >
                          {team.match(/\d+/)}
                        </span>
                        {props.match?.alliances?.red?.dq_team_keys?.includes(
                          team
                        ) && (
                          <div className="bg-red-400 h-3 w-2 inline-block ml-1"></div>
                        )}
                      </span>
                    </Link>
                  </>
                )
              )}
          )
        </span>
      </td>
      <td
        className={`px-6 py-4 ${
          props.match.winning_alliance === "blue"
            ? "text-green-400"
            : "text-lightGray"
        }`}
      >
        <p className="text-white font-bold mb-1">
          {props.match.alliances.blue.score ?? "?"}{" "}
          {props.match.alliances.blue.score === 0 && (
            <div className="bg-red-400 h-3 w-2 inline-block"></div>
          )}
          {/* <span className="border border-[#2A2A2A] text-xs text-lightGray py-[2px] px-2 ml-1 rounded-full">
            {json.blueEPA} EPA
          </span>{" "} */}
          <br />
          {/* {blueScore || blueScore != undefined || !Number.isNaN(blueScore) ? (
            <p className="text-xs text-lightGray mt-1">
              {blueScore - json.blueEPA > 0 ? (
                <span className="text-green-400">
                  +{(blueScore - json.blueEPA).toFixed(1)}pts
                </span>
              ) : (
                <span className="text-red-400">
                  {(blueScore - json.blueEPA).toFixed(1)}pts
                </span>
              )}{" "}
              •{" "}
              {blueScore - json.blueEPA > 0 ? "OUTPERFORMED" : "UNDERPERFORMED"}
            </p>
          ) : (
            ""
          )} */}
        </p>

        <span className="font-regular">
          (
          {props.match.alliances.blue.team_keys.includes("frc0")
            ? "TBD"
            : props.match.alliances.blue.team_keys.map(
                (team: any, i: number) => (
                  <>
                    {i > 0 && ", "}
                    <Link href={`/teams/${team.substring(3)}`}>
                      <span
                        className={`hover:text-primary ${
                          team.substring(3) === props.team &&
                          "text-white font-semibold"
                        }`}
                      >
                        <span
                          className={`${
                            props.match?.alliances?.blue?.dq_team_keys.includes(
                              team
                            ) && "line-through text-red-400 hover:text-primary"
                          } ${
                            props.match?.alliances?.blue?.surrogate_team_keys.includes(
                              team
                            ) && "underline decoration-dotted"
                          }`}
                        >
                          {team.match(/\d+/)}
                        </span>
                        {props.match.alliances.blue.dq_team_keys.includes(
                          team
                        ) && (
                          <div className="bg-red-400 h-3 w-2 inline-block ml-1"></div>
                        )}
                      </span>
                    </Link>
                  </>
                )
              )}
          )
        </span>
      </td>
    </tr>
  );
};
