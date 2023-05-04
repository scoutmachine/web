import { Tooltip } from "@/components/Toolip";
import Link from "next/link";
import Image from "next/image";

export const TeamsScreen = (props: any) => {
  return (
    <div className="flex flex-col md:grid grid-cols-3 gap-3 mt-5">
      {props.teams.map((team: any, key: number) => {
        return (
          <Tooltip team={team} key={key}>
            <Link href={`/teams/${team.team_number}`} legacyBehavior>
              <a>
                <div className="bg-gray-700 border-2 border-gray-500 hover:bg-gray-600 rounded-lg py-3 px-5">
                  <h1 className="font-bold text-gray-300 text-xl">
                    {team.nickname.length > 16
                      ? `${team.nickname.slice(0, 16)}...`
                      : team.nickname}
                  </h1>
                  <p className="text-lightGray">Team {team.team_number}</p>
                </div>
              </a>
            </Link>
          </Tooltip>
        );
      })}
    </div>
  );
};
