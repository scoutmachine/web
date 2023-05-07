import Link from "next/link";
import { useState, useEffect } from "react";
import { FaYoutube, FaTimes } from "react-icons/fa";

const newText = [
  {
    name: "f",
    new: "Final",
  },
  {
    name: "sf",
    new: "Semi Final",
  },
  {
    name: "qf",
    new: "Quarter Final",
  },
  {
    name: "qm",
    new: "Qualification",
  },
];

const EventList = (props: any) => {
  return (
    <tr className="text-lightGray border border-[#2A2A2A] bg-card hover:bg-[#191919]">
      <td className="px-6 py-4">
        {props.match.videos && props.match.videos.length > 0 ? (
          <a
            href={`https://www.youtube.com/watch?v=${props.match.videos[0].key}`}
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
              className={`font-bold ${
                props.didWeWin() === "win" && props.isTeam && "text-green-400"
              } ${
                props.didWeWin() === "lose" && props.isTeam && "text-red-400"
              } ${
                props.didWeWin() === "unknown" &&
                props.isTeam &&
                "text-lightGray"
              }`}
            >
              {props.search_array(newText, props.match.comp_level)}{" "}
              {props.match.comp_level !== "qm"
                ? `${props.match.set_number} (Match ${props.match.match_number})`
                : props.match.match_number}
            </span>{" "}
          </a>
        </Link>
      </th>

      {props.isTeam && (
        <td className="px-6 py-4">
          <span className="text-lightGray">
            <span
              className={` ${
                props.findAlliances().alliance === "Red"
                  ? "text-red-400"
                  : "text-sky-400"
              }`}
            >
              {props.findAlliances().alliance}
            </span>{" "}
          </span>
        </td>
      )}
      <td className="px-6 py-4">
        <span className="font-bold">
          {props.match.score_breakdown
            ? props.match.score_breakdown.red.totalPoints
            : "?"}{" "}
        </span>
        <span className="text-lightGray font-regular">
          (
          {props.match.alliances.red.team_keys.includes("frc0")
            ? "TBD"
            : props.match.alliances.red.team_keys
                .map((team: any) => team.substring(3))
                .join(", ")}
          )
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-bold">
          {props.match.score_breakdown
            ? props.match.score_breakdown.blue.totalPoints
            : "?"}{" "}
        </span>
        <span className="text-lightGray font-regular">
          (
          {props.match.alliances.blue.team_keys.includes("frc0")
            ? "TBD"
            : props.match.alliances.blue.team_keys
                .map((team: any) => team.substring(3))
                .join(", ")}
          )
        </span>
      </td>
    </tr>
  );
};

export const EventData = (props: any) => {
  const [isClient, setIsClient] = useState(false);

  function search_array(array: any, valuetofind: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name == valuetofind) {
        return array[i].new;
      }
    }
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  const findAlliances = (match: any) => {
    if (match.alliances.blue.team_keys.includes(`frc${props.team}`)) {
      return {
        teams: match.alliances.blue.team_keys.map((team: any) =>
          team.substring(3)
        ),
        alliance: "Blue",
      };
    } else {
      return {
        teams: match.alliances.red.team_keys.map((team: any) =>
          team.substring(3)
        ),
        alliance: "Red",
      };
    }
  };

  const didWeWin = (match: any) => {
    if (
      match.score_breakdown &&
      findAlliances(match).alliance.toLowerCase() === match.winning_alliance
    ) {
      return "win";
    } else if (!match.score_breakdown) {
      return "unknown";
    } else {
      return "lose";
    }
  };

  return (
    <>
      {isClient && (
        <div className="relative overflow-x-auto">
          {props.isTeam && (
            <div className="border border-[#2a2a2a] bg-[#191919] text-lightGray mt-5 px-5 py-3 rounded-lg">
              <span className="text-green-400">Win</span> /{" "}
              <span className="text-red-400">Loss</span> /{" "}
              <span className="text-lightGray">Unknown</span>
            </div>
          )}
          <table className="w-full mt-5 text-sm text-left bg-[#191919] border border-[#2A2A2A]">
            <thead className="text-xs text-white uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  VIDEO
                </th>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                {props.isTeam && (
                  <th scope="col" className="px-6 py-3">
                    Alliance
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-red-400">
                  Red Score
                </th>
                <th scope="col" className="px-6 py-3 text-sky-400">
                  Blue Score
                </th>
              </tr>
            </thead>
            <tbody>
              {props.data
                ?.filter((match: any) => match.comp_level === "f")
                .reverse()
                .map((match: any, key: number) => {
                  return (
                    <EventList
                      match={match}
                      didWeWin={() => didWeWin(match)}
                      findAlliances={() => findAlliances(match)}
                      search_array={search_array}
                      key={key}
                      isTeam={props.isTeam}
                    />
                  );
                })}

              {props.data
                ?.filter(
                  (match: any) =>
                    match.comp_level === "sf" || match.comp_level === "qf"
                )
                .sort(
                  (matchA: any, matchB: any) =>
                    parseInt(matchB.set_number) - parseInt(matchA.set_number)
                )
                .map((match: any, key: number) => {
                  return (
                    <EventList
                      match={match}
                      didWeWin={() => didWeWin(match)}
                      findAlliances={() => findAlliances(match)}
                      search_array={search_array}
                      key={key}
                      isTeam={props.isTeam}
                    />
                  );
                })}

              {props.data
                ?.filter((match: any) => match.comp_level === "qm")
                .sort(
                  (matchA: any, matchB: any) =>
                    parseInt(matchB.match_number) -
                    parseInt(matchA.match_number)
                )
                .map((match: any, key: number) => {
                  return (
                    <EventList
                      match={match}
                      didWeWin={() => didWeWin(match)}
                      findAlliances={() => findAlliances(match)}
                      search_array={search_array}
                      key={key}
                      isTeam={props.isTeam}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
