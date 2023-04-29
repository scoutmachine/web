const Card = (props: any) => {
  return (
    <div className="bg-gray-700 px-5 py-5 rounded-lg flex">
      <h1 className="font-bold mr-2">{props.title}</h1>
      <p className="text-gray-400">{props.desc}</p>
    </div>
  );
};

export const AboutTab = (props: any) => {
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
    <div className="flex grid grid-cols-4 gap-x-3 mt-5">
      <Card
        title="Seasons Completed:"
        desc={props.team.yearsParticipated.length}
      />
      <Card title="Total Event Wins:" desc={eventsWon} />
      <Card title="Avg Awards per Season:" desc={avgAwards} />
    </div>
  );
};
