import { TeamCard } from "@/components/TeamCard";

export const TeamsTab = (props: any) => {
  return (
    <div className="flex flex-col md:grid grid-cols-4 gap-3 mt-5">
      {props.teams.map((team: any, key: number) => {
        return <TeamCard key={key} team={team} favourites={props.favourites} />;
      })}
    </div>
  );
};
