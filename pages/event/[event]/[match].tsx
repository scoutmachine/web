import { Navbar } from "@/components/navbar";
import db from "@/lib/db";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { JSX, useEffect, useState } from "react";
import { Match, Event, FormQuestion } from "@prisma/client";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaCube, FaTrophy, FaYoutube } from "react-icons/fa";
import { ImCheckmark, ImCross } from "react-icons/im";
import { BsCone } from "react-icons/bs";
import { Footer } from "@/components/Footer";
import { GoPrimitiveDot } from "react-icons/go";
import { API_URL } from "@/lib/constants";

const DividerSection = ({ headerName }: { headerName: string }) => {
  return (
    <div className="relative mt-5">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-[#2A2A2A]" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <h1 className="bg-card py-1 px-5 rounded-lg text-center text-xl text-white font-bold">
          {headerName}
        </h1>
      </div>
    </div>
  );
};

const AllianceGroup = ({
  allianceColor,
  alliance,
  winningAlliance,
  onChangeTeam,
  selectedTeam,
  allTeams,
}: {
  alliance: any;
  allianceColor: "red" | "blue";
  winningAlliance: "red" | "blue";
  onChangeTeam: (team: string) => void;
  selectedTeam: string;
  allTeams: any;
}) => {
  console.log("alliance: ", alliance);
  const color = allianceColor === "red" ? "red" : "sky";

  return (
    <div className={`bg-${color}-500 rounded-md p-5`}>
      <h1
        className={`text-3xl font-bold mb-4 text-${color}-200 text-center capitalize`}
      >
        {allianceColor} Alliance{" "}
        <button
          className={`cursor-default bg-${color}-600 rounded-lg text-sm align-middle py-1 px-3 text-white`}
        >
          <span className="flex">
            {alliance.score} pts{" "}
            {winningAlliance === allianceColor && (
              <FaTrophy className="mt-1 ml-1" />
            )}
          </span>
        </button>
      </h1>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
        {alliance.team_keys.map((team: any, key: number) => {
          return (
            <div
              key={team}
              onClick={() => {
                onChangeTeam?.(team === selectedTeam ? "" : team);
              }}
            >
              <div
                className={`bg-${color}-400 hover:bg-${color}-600 rounded-lg py-5`}
              >
                <p
                  className={`text-center text-sm font-semibold text-${color}-200 mb-1`}
                >
                  {allTeams[team.substring(3)].nickname}
                </p>
                <h1
                  className={`text-xl flex items-center justify-center font-bold text-white`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="rounded-lg mr-4 w-7"
                    alt={`Team ${team.substring(3)} Avatar`}
                    height="50"
                    width="50"
                    src={`${API_URL}/api/og/avatar?team=${team.substring(3)}`}
                  />
                  Team {team.substring(3)}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const AllianceBreakdown = ({
  match,
  teams,
  onChangeTeam,
  selectedTeam,
}: any) => {
  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
      <AllianceGroup
        alliance={match.alliances.red}
        winningAlliance={match.winning_alliance}
        onChangeTeam={onChangeTeam}
        selectedTeam={selectedTeam}
        allTeams={teams}
        allianceColor="red"
      />
      <AllianceGroup
        alliance={match.alliances.blue}
        winningAlliance={match.winning_alliance}
        onChangeTeam={onChangeTeam}
        selectedTeam={selectedTeam}
        allTeams={teams}
        allianceColor="blue"
      />
    </div>
  );
};

const BooleanQuestion = ({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: any;
  onChange: any;
}) => {
  return (
    <div className="flex items-center mb-4 text-white rounded py-1 px-2">
      <div className="w-1/2 pl-2">
        <span className="flex text-lightGray">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={() => onChange(!value)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </span>

        {/* <span className="flex text-lightGray">
					<div className="flex items-center mr-3">
						<input type="radio" name="autonomous" value="yes" className="mr-2"/>
						<span>Yes</span>
					</div>
					<div className="flex items-center mr-3">
						<input type="radio" name="autonomous" value="no" className="mr-2"/>
						<span>No</span>
					</div>
				</span> */}
      </div>
    </div>
  );
};
const CounterQuestion = ({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: any;
  onChange: any;
}) => {
  return (
    // Using tailwind, create a grouped input box with a minus button, the value, and a plus button
    <div className="flex items-center mb-4 text-white rounded py-1 px-2">
      <div className="w-1/2 pl-2">
        <span className="flex text-lightGray">
          <div className="flex items-center mr-3">
            <button
              onClick={() => {
                onChange(value - 1);
              }}
              className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
            >
              -
            </button>
            <span className="mx-2">{value}</span>
            <button
              onClick={() => {
                onChange(value + 1);
              }}
              className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </span>
      </div>
    </div>
  );
};

const QuestionRow = ({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: any;
  onChange: (newVal: any) => void;
}) => {
  return (
    <div key={question.id} className="rounded-md w-full">
      <div className="flex items-center text-white rounded py-1 px-2">
        <div className="pr-2">
          <span className="text-lightGray font-semibold">{question.title}</span>
        </div>
        {question.type === "boolean" && (
          <BooleanQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        )}
        {question.type === "counter" && (
          <CounterQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

const getIntitialFormState = (questions: FormQuestion[]) => {
  const form: any = {};

  for (const question of questions) {
    if (question.type === "boolean") {
      form[question.id] = {
        questionId: question.id,
        value: false,
      };
    } else if (question.type === "counter") {
      form[question.id] = {
        questionId: question.id,
        value: 0,
      };
    }
  }

  return form;
};

const questions: FormQuestion[] = [
  {
    description: "",
    formId: 1,
    id: 1,
    type: "boolean",
    title: "Did the robot move in autonomous?",
    options: ["Yes", "No"],
    required: true,
  },
  {
    description: "",
    formId: 1,
    id: 2,
    type: "counter",
    title: "How many points were scored?",
    // TODO: Optional and remove
    options: ["Yes", "No"],
    required: true,
  },
];
const ScoutForm = ({ selectedTeam }: { selectedTeam: string }) => {
  const [form, setForm] = useState<any>(getIntitialFormState(questions));

  console.log("form: ", form);
  useEffect(() => {
    // Reset form if the selected team changes
    setForm(getIntitialFormState(questions));
  }, [selectedTeam]);

  if (!selectedTeam)
    return (
      <div>
        <DividerSection headerName={`Scout Form`} />
        <div className="pr-2">
          <span className="text-lightGray font-semibold">
            Select a team to begin scouting
          </span>
        </div>
      </div>
    );
  return (
    <div className="flex flex-col">
      <DividerSection headerName={`Scout Form (${selectedTeam})`} />
      {questions.map((question: FormQuestion) => {
        return (
          <QuestionRow
            key={question.id}
            question={question}
            value={form[question.id].value}
            onChange={(newVal) => {
              setForm({
                ...form,
                [question.id]: {
                  ...form[question.id],
                  value: newVal,
                },
              });
            }}
          />
        );
      })}
      {/* Full width submit button */}
      <button className="text-lg mt-3 w-full bg-green-500 border text-center text-gray-300 hover:bg-green-600  py-2 px-5 rounded-lg">
        Submit
      </button>
    </div>
  );
};

const BoxRow = ({ alliance, scoringData, level, links, autoData }: any) => {
  const linkNodes = links.filter((link: any) => link.row === level);
  const linkIndices = linkNodes.flatMap((link: any) => link.nodes);
  const levelKey = level.charAt(0).toUpperCase();

  const hasLinkInGroup = linkIndices.some(
    (index: number): boolean => scoringData[index] !== "None"
  );

  const boxes = scoringData.map((item: any, index: number) => {
    const hasLink = linkIndices.includes(index);
    const isAutoScored: boolean = autoData[levelKey][index] !== "None";

    let boxClasses: string =
      "border-2 bg-card h-16 rounded-md flex justify-center items-center";

    if (alliance === "red" && !hasLink && !isAutoScored) {
      boxClasses += " border-red-400";
    } else if (alliance === "blue" && !hasLink && !isAutoScored) {
      boxClasses += " border-sky-400";
    } else if (hasLink && hasLinkInGroup) {
      boxClasses += " border-white";
    } else if (isAutoScored) {
      boxClasses += " border-green-400";
    }

    return (
      <div key={index} className={boxClasses}>
        {item === "Cube" ? (
          <span role="img" aria-label="cube">
            <FaCube className="text-purple-400 text-2xl" />
          </span>
        ) : item === "Cone" ? (
          <span role="img" aria-label="cone">
            <BsCone className="text-yellow-400 text-2xl" />
          </span>
        ) : (
          <span role="img" aria-label="none">
            <GoPrimitiveDot className="text-lightGray text-xl" />
          </span>
        )}
      </div>
    );
  });

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-9 gap-4">
      <div className="sm:col-span-2 md:col-span-9 text-center text-lightGray font-bold">
        {level} Nodes
      </div>
      {boxes}
    </div>
  );
};

const StatsTable = ({ breakdown, teams }: any) => {
  const data: (
    | { category: string; value: any; important?: undefined }
    | { category: string; value: any; important: boolean }
  )[] = [
    {
      category: "Mobility",
      value: breakdown.autoMobilityPoints,
    },
    {
      category: "Auto Game Piece Count",
      value: breakdown.autoGamePieceCount,
    },
    {
      category: "Auto Game Piece Points",
      value: breakdown.autoGamePiecePoints,
    },
    {
      category: `Robot 1 (${teams[0]}) Auto Charge Station`,
      value: breakdown.autoChargeStationRobot1,
    },
    {
      category: `Robot 2 (${teams[1]}) Auto Charge Station`,
      value: breakdown.autoChargeStationRobot2,
    },
    {
      category: `Robot 3 (${teams[2]}) Auto Charge Station`,
      value: breakdown.autoChargeStationRobot3,
    },
    {
      category: "Total Auto Points",
      value: breakdown.autoPoints,
      important: true,
    },
    {
      category: "Teleop Game Piece Count",
      value: breakdown.teleopGamePieceCount,
    },
    {
      category: "Teleop Game Piece Points",
      value: breakdown.teleopGamePiecePoints,
    },
    {
      category: `Robot #1 (${teams[0]}) Endgame Charge Station`,
      value: breakdown.endGameChargeStationRobot1,
    },
    {
      category: `Robot #2 (${teams[1]}) Endgame Charge Station`,
      value: breakdown.endGameChargeStationRobot2,
    },
    {
      category: `Robot #3 (${teams[2]}) Endgame Charge Station`,
      value: breakdown.endGameChargeStationRobot3,
    },
    {
      category: "Total Teleop Points",
      value: breakdown.teleopPoints,
      important: true,
    },
    {
      category: "Links",
      value: breakdown.linkPoints,
    },
    {
      category: "Cooperation Criteria Met?",
      value: breakdown.coopertitionCriteriaMet ? (
        <ImCheckmark className="text-green-400" />
      ) : (
        <ImCross className="text-red-400" />
      ),
    },
    {
      category: "Sustainability Bonus?",
      value: breakdown.sustainabilityBonusAchieved ? (
        <ImCheckmark className="text-green-400" />
      ) : (
        <ImCross className="text-red-400" />
      ),
    },
    {
      category: "Activation Bonus?",
      value: breakdown.activationBonusAchieved ? (
        <ImCheckmark className="text-green-400" />
      ) : (
        <ImCross className="text-red-400" />
      ),
    },
    {
      category: "Foul Points",
      value: breakdown.foulPoints,
    },
    {
      category: "Adjustments",
      value: breakdown.adjustPoints,
    },
    {
      category: "Total Points",
      value: breakdown.totalPoints,
      important: true,
    },
    {
      category: "Ranking Points",
      value: `+${breakdown.rp} RP`,
      important: true,
    },
  ];

  return (
    <div className="mt-5">
      <div className="bg-card rounded-md p-4 w-full">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex items-center mb-4 text-white rounded py-1 px-2 ${
              item.important && "bg-[#2A2A2A]"
            }`}
          >
            <div className="w-1/2 pr-2">
              <span
                className={`${
                  item.important
                    ? "text-white font-bold"
                    : "text-lightGray font-semibold"
                }`}
              >
                {item.category}
              </span>
            </div>
            <div className="w-1/2 pl-2">
              <span
                className={`flex ${
                  item.important ? "text-white" : "text-lightGray"
                }`}
              >
                {item.value === "None" ? (
                  <ImCross className="mt-1 mr-2 text-red-400" />
                ) : ["Docked", "Engaged", "Park"].includes(item.value) ? (
                  <>
                    <ImCheckmark className="mt-1 mr-2 text-green-400" />{" "}
                    {item.value}
                  </>
                ) : (
                  item.value
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MatchData = ({ event, breakdown, teams }: any): JSX.Element => {
  const redNodes = breakdown.red.teleopCommunity;
  const blueNodes = breakdown.blue.teleopCommunity;
  const redAutoNodes = breakdown.red.autoCommunity;
  const blueAutoNodes = breakdown.blue.autoCommunity;
  const redLinks = breakdown.red.links;
  const blueLinks = breakdown.blue.links;

  switch (event.substring(0, 4)) {
    case "2023":
      return (
        <>
          <DividerSection headerName="Score Breakdown" />
          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4">
            <StatsTable
              breakdown={breakdown.red}
              teams={teams.red.team_keys.map((team: string) =>
                team.substring(3)
              )}
            />
            <StatsTable
              breakdown={breakdown.blue}
              teams={teams.blue.team_keys.map((team: string) =>
                team.substring(3)
              )}
            />
          </div>

          <DividerSection headerName="Score Location Breakdown" />

          <div className="text-lightGray rounded-lg py-2 flex flex-wrap items-center justify-center">
            <div className="h-6 w-6 border-2 border-red-400 rounded-md mr-2"></div>{" "}
            Red Alliance
            <div className="h-6 w-6 border-2 border-sky-400 rounded-md ml-3 mr-2"></div>{" "}
            Blue Alliance
            <div className="h-6 w-6 border-2 border-white rounded-md ml-3 mr-2"></div>{" "}
            Link
            <div className="flex mt-2 md:mt-0">
              <div className="h-6 w-6 border-2 border-green-400 rounded-md ml-3 mr-2"></div>{" "}
              Scored in Auto
              <FaCube className="ml-3 mr-2 text-purple-400 text-2xl" /> Cube
              <BsCone className="ml-3 mr-2 text-yellow-400 text-2xl" /> Cone
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {/* Top Nodes */}
            <BoxRow
              alliance="red"
              scoringData={redNodes.T}
              level="Top"
              links={redLinks}
              autoData={redAutoNodes}
            />
            <BoxRow
              alliance="blue"
              scoringData={blueNodes.T}
              level="Top"
              links={blueLinks}
              autoData={blueAutoNodes}
            />

            {/* Middle Nodes */}
            <BoxRow
              alliance="red"
              scoringData={redNodes.M}
              level="Middle"
              links={redLinks}
              autoData={redAutoNodes}
            />
            <BoxRow
              alliance="blue"
              scoringData={blueNodes.M}
              level="Middle"
              links={blueLinks}
              autoData={blueAutoNodes}
            />

            {/* Bottom Nodes */}
            <BoxRow
              alliance="red"
              scoringData={redNodes.B}
              level="Bottom"
              links={redLinks}
              autoData={redAutoNodes}
            />
            <BoxRow
              alliance="blue"
              scoringData={blueNodes.B}
              level="Bottom"
              links={blueLinks}
              autoData={blueAutoNodes}
            />
          </div>
        </>
      );

    default:
      return <h1>In Progress...</h1>;
  }
};

export default function MatchPage({
  match,
  teamData,
  eventData,
}: any): JSX.Element {
  const router = useRouter();
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const { event } = router.query;

  console.log(match);

  const findMatchName = () => {
    switch (match.comp_level) {
      case "f":
        return "Finals";

      case "sf":
        return "Semi Finals";

      case "qf":
        return "Quarter Finals";

      case "qm":
        return "Qualification Match";
    }
  };

  const title: string = `${findMatchName()} #${
    match.match_number
  } / ${match.event_key.slice(4).toUpperCase()} / Scout Machine`;

  const videos: string[] = [];

  match.videos
    .filter((video: any): boolean => video.type === "youtube")
    .forEach((video: any): void => {
      if (video.key) videos.push(video.key);
    });

  return (
    <>
      <SEO title={title} />

      {/* <Navbar /> */}

      <div className="pr-4 pl-4 md:pr-8 md:pl-8 max-w-screen-3xl">
        <div className="bg-card mb-5 mt-10 p-5 rounded-lg border dark:border-[#2A2A2A]">
          <h1 className="text-black dark:text-lightGray text-2xl text-center">
            {findMatchName()}{" "}
            <b className="text-white">#{match.match_number}</b>
          </h1>
          <p className="text-lightGray text-center">
            {eventData.name} {String(event).substring(0, 4)}
          </p>

          {videos.length > 0 && (
            <div className="flex justify-center items-center">
              <a
                href={`https://youtube.com/watch_videos?video_ids=${videos.join(
                  ","
                )}&title=${eventData.name}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <button className="text-sm flex mt-3 bg-[#191919] border dark:border-[#2A2A2A] text-center text-red-500 hover:text-white  py-2 px-5 rounded-lg">
                  <FaYoutube className={`mr-2 text-lg mt-[1px]`} /> Watch Match
                  Videos
                </button>
              </a>
            </div>
          )}
        </div>
        <AllianceBreakdown
          match={match}
          teams={teamData}
          selectedTeam={selectedTeam}
          onChangeTeam={setSelectedTeam}
        />

        <ScoutForm selectedTeam={selectedTeam} />
        <MatchData
          event={event}
          teams={match.alliances}
          breakdown={match.score_breakdown}
        />
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<{
  props: { match: any; teamData: any; eventData: any };
}> => {
  const { event, match }: any = context.params;
  const teamData: any = {};

  const matchData: Match | null | any = await db.match.findUnique({
    where: {
      key: `${event}_${match}`,
    },
  });

  const redTeamPromises = matchData?.alliances.red.team_keys.map(
    async (team: any): Promise<void> => {
      teamData[team.substring(3)] = await db.team.findUnique({
        where: {
          team_number: Number(team.substring(3)),
        },
      });
    }
  );

  const blueTeamPromises = matchData?.alliances.blue.team_keys.map(
    async (team: any): Promise<void> => {
      teamData[team.substring(3)] = await db.team.findUnique({
        where: {
          team_number: Number(team.substring(3)),
        },
      });
    }
  );

  await Promise.all([...redTeamPromises, ...blueTeamPromises]);

  const formattedMatchData = JSON.parse(
    JSON.stringify(matchData, (key: string, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
  const eventData: Event | null = await db.event.findUnique({
    where: {
      key: formattedMatchData.event_key,
    },
  });

  return {
    props: {
      match: formattedMatchData,
      teamData,
      eventData,
    },
  };
};
