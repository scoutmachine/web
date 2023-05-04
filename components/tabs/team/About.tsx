import { getStorage } from "@/util/localStorage";

const Card = (props: any) => {
  return (
    <div className="border dark:border-[#2A2A2A] dark:bg-card px-5 py-5 rounded-lg flex">
      <h1 className="font-bold mr-2">{props.title}</h1>
      <p className="text-lightGray">{props.desc}</p>
    </div>
  );
};

export const AboutTab = (props: any) => {
  // const events = getStorage(`team_${props.team.teamData.team_number}_events`);

  // const firstChampionship = events.filter((event: any) => {
  //   return event.event_type_string === "Championship Division";
  // });

  const calcAvg = (data1: number, data2: number) => {
    return Math.round(data1 / data2);
  };

  const avgAwards = calcAvg(
    props.team.teamAwards.length,
    props.team.yearsParticipated.length
  );

  const eventsWon = props.team.teamAwards.filter((award: any) =>
    award.name.includes("Winner")
  ).length;

  return (
    <div className="flex grid grid-cols-4 gap-4 mt-5">
      <Card
        title="Seasons Completed:"
        desc={props.team.yearsParticipated.length}
      />
      {/* <Card title="Events Competed:" desc={events.length} /> */}
      <Card title="Event Wins:" desc={eventsWon} />
      <Card title="Awards Won:" desc={props.team.teamAwards.length} />
      <Card title="Avg Awards per Season:" desc={avgAwards} />
      {/* <Card
        title="Trips to FIRST Championship:"
        desc={firstChampionship.length}
      /> */}
    </div>
  );
};
