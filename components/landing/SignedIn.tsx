import { Session } from "next-auth";
import { TeamCard } from "../TeamCard";
import { FaStar } from "react-icons/fa";

export const SignedInScreen = (props: {
  session: Session;
  favourites: any;
  avatars: any;
}) => {
  return (
    <div className="pr-8 pl-8 max-w-screen-3xl w-full">
      <div className="border dark:border-[#2a2a2a] dark:bg-[#191919] mt-10 rounded-lg px-10 py-10">
        <h1 className="flex font-bold text-5xl">
          Welcome back, 
          <span className="text-primary ml-2">
            {props.session.user?.name?.split(" ")[0]}!
          </span>
        </h1>
        <p className="text-lightGray font-medium">
        {props.session.user?.email}
        </p>
      </div>

      <p className="flex text-lightGray font-bold text-md mt-16">
        <FaStar className="text-[22px] mr-2 text-primary" /> FAVOURITED TEAMS
      </p>
      {props.favourites ? (
        <div className="mt-3 sm:grid sm:grid-cols-2 md:grid md:grid-cols-6 gap-3">
          {props.favourites.map((team: any, key: number) => {
            return <TeamCard key={key} team={team} avatars={props.avatars} />;
          })}
        </div>
      ) : (
        <span className="text-lightGray text-sm font-medium">
          Looks like you have no favourited teams.
        </span>
      )}
    </div>
  );
};
