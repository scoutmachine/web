import { API_URL } from "@/lib/constants";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaYoutube, FaTimes } from "react-icons/fa";
import { Loading } from "./Loading";

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
  if (!props.epas) return <Loading />;

  const json =
    props.epas && props.epas[props.match.key]
      ? JSON.parse(JSON.stringify(props.epas[props.match.key]))
      : "";

  const epa =
    props.findAlliances().alliance === "Red" ? json.redEPA : json.blueEPA;
  const totalPoints =
    props.findAlliances().alliance === "Red"
      ? props.match?.score_breakdown?.red?.totalPoints
      : props.match?.score_breakdown?.blue?.totalPoints;

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
              className={` hover:text-primary ${
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
            {props.isTeam && epa && totalPoints && (
              <p>
                ({Number(epa).toFixed(1)} EPA{" "}
                <span className="text-white">
                  {totalPoints - epa > 0
                    ? `+${(totalPoints - epa).toFixed(1)}pts`
                    : `${(totalPoints - epa).toFixed(1)}pts`}
                  )
                  <br />
                  <span className="uppercase text-xs text-lightGray">
                    {totalPoints - epa > 0 ? "Outperformed" : "Underperformed"}
                  </span>
                </span>
              </p>
            )}
          </span>
        </td>
      )}
      <td
        className={`px-6 py-4 ${
          props.match.winning_alliance === "red"
            ? "text-green-400"
            : "text-lightGray"
        }`}
      >
        <span className="font-bold">
          {props.match.score_breakdown
            ? props.match.score_breakdown.red.totalPoints
            : "?"}{" "}
        </span>
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
                          "text-white font-bold"
                        }`}
                      >
                        {team.match(/\d+/)}
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
        <span className="font-bold">
          {props.match.score_breakdown
            ? props.match.score_breakdown.blue.totalPoints
            : "?"}{" "}
        </span>
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
                          "text-white font-bold"
                        }`}
                      >
                        {team.match(/\d+/)}
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

export const EventData = (props: any) => {
  const [isClient, setIsClient] = useState(false);
  const [matchEPAs, setMatchEPAs] = useState([]);

  function search_array(array: any, valuetofind: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].name == valuetofind) {
        return array[i].new;
      }
    }
  }

  useEffect(() => {
    setIsClient(true);

    const fetchEPAs = async () => {
      const matches: any = {};

      await Promise.all(
        props.data.map(async (match: any) => {
          const data = await fetch(
            `${API_URL}/api/match/epa?match=${match.key}`
          ).then((res) => res.json());
          matches[match.key] = data;
        })
      );

      setMatchEPAs(matches);
    };

    fetchEPAs();
  }, [props.data]);

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

  if (!matchEPAs) {
    props.setLoading(true);
  } else {
    props.setLoading(false);
  }

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
                  Video
                </th>
                <th scope="col" className="px-6 py-3">
                  Match #
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
                      epas={matchEPAs}
                      team={props.team}
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
                      epas={matchEPAs}
                      team={props.team}
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
                      epas={matchEPAs}
                      team={props.team}
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
