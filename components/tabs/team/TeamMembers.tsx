import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export const TeamMembersTab = (props: any) => {
  return (
    <div className="mt-5">
      {props.members.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {props.members.map((member: any, key: number) => {
            return (
              <Link key={key} href={`/users/${member.username}`}>
                <div className="group flex bg-card border border-[#2A2A2A] hover:border-gray-600 rounded-lg px-5 py-5">
                  {" "}
                  <img
                    src={member.image}
                    className="rounded-full h-8 w-8 mr-2"
                    alt={`${member.name} Avatar`}
                  />
                  <h1 className="font-bold text-2xl group-hover:text-primary whitespace-nowrap">
                    {member.name}
                  </h1>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-lightGray">
          No team members found for{" "}
          <span className="text-black dark:text-white">
            {props.team.team_number} | {props.team.nickname}
          </span>
          .
        </p>
      )}
    </div>
  );
};
