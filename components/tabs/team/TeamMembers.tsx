/* eslint-disable @next/next/no-img-element */
export const TeamMembersTab = (props: any) => {
  return (
    <div className="flex flex-col grid sm:grid-cols-2 md:grid-cols-6">
      {props.members.map((member: any, key: number) => {
        return (
          <div
            key={key}
            className="group mt-5 flex bg-card border border-[#2A2A2A] hover:border-gray-600 rounded-lg px-5 py-5"
          >
            {" "}
            <img
              src={member.image}
              className="rounded-full h-8 w-8 mr-2"
              alt={`${member.name} Avatar`}
            />
            <h1 className="font-bold text-2xl group-hover:text-primary">
              {member.name}
            </h1>
          </div>
        );
      })}
    </div>
  );
};
