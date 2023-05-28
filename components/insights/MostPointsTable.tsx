import React from "react";

const Table = ({ title, desc, matches }: any) => {
  const renderTableRows = (matches: any[]) => {
    return matches.map((match) => (
      <React.Fragment key={match.id}>
        <tr>
          <td className="px-6 py-4 text-red-400 text-xl">
            {match.alliances.red.team_keys
              .map((team: string) => team.substring(3))
              .join(", ")}
          </td>
          <td className="px-6 py-4 text-white text-xl">
            {match.alliances.red.score}
          </td>
        </tr>
        <tr className="border-white">
          <td className="px-6 py-4 text-sky-400 text-xl">
            {match.alliances.blue.team_keys
              .map((team: string) => team.substring(3))
              .join(", ")}
          </td>
          <td className="px-6 py-4 text-white text-xl">
            {match.alliances.blue.score}
          </td>
        </tr>
      </React.Fragment>
    ));
  };

  return (
    <div className="w-1/2 pr-2">
      <h2 className="text-lg font-bold text-lightGray">{title}</h2>
      <p className="text-sm font-bold text-lightGray">{desc}</p>
      <table className="w-full mt-3 text-sm text-left bg-[#191919] border border-[#2A2A2A]">
        <thead className="text-xs text-black dark:text-white uppercase">
          <tr>
            <th scope="col" className="px-6 py-3">
              Alliance
            </th>
            <th scope="col" className="px-6 py-3">
              Score
            </th>
          </tr>
        </thead>
        <tbody>{renderTableRows(matches)}</tbody>
      </table>
    </div>
  );
};

export const MostPointsTable = (props: any) => {
  const { qualMatches, playoffMatches } = props;

  return (
    <>
      <h1 className="font-bold text-2xl mt-5 text-white">
        Most Qualification Match Points
      </h1>
      <div className="flex mt-3">
        <Table
          title="With Penalties"
          desc={qualMatches.withPenaltyData[0].key}
          matches={qualMatches.withPenaltyData}
        />
        <Table
          title="Without Penalties"
          desc={qualMatches.withoutPenaltyData[0].key}
          matches={qualMatches.withoutPenaltyData}
        />
      </div>

      <h1 className="font-bold text-2xl mt-5 text-white">
        Most Playoff Match Points
      </h1>
      <div className="flex mt-3">
        <Table
          title="With Penalties"
          desc={playoffMatches.withPenaltyData[0].key}
          matches={playoffMatches.withPenaltyData}
        />
        <Table
          title="Without Penalties"
          desc={playoffMatches.withoutPenaltyData[0].key}
          matches={playoffMatches.withoutPenaltyData}
        />
      </div>
    </>
  );
};
