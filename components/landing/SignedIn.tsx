import { Session } from "next-auth";

export const SignedInScreen = (props: { session: Session }) => {
  return (
    <div className="pr-8 pl-8">
      <h1 className="font-bold text-5xl mt-32">
        Welcome back, <span className="text-primary">{props.session?.user?.name?.split(" ")[0]}!</span>
      </h1>

      <p className="text-lightGray font-bold text-md mt-16">FAVOURITED TEAMS</p>
      <span className="text-lightGray text-sm font-medium">Looks like you have no favourited teams.</span>
    </div>
  );
};
