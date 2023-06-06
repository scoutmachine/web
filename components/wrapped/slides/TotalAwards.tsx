import dynamic from "next/dynamic";
import { WrappedContainer } from "../WrappedContainer";
import { CURR_YEAR } from "@/lib/constants";
import lookup from "@/utils/lookup";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

const comments = {
  0: "Not a single one?",
  1: "Just one?",
  3: "That's pretty normal. Didn't make Worlds this year?",
  4: "Wowza, you must always be on the road!",
  5: "Wow! That's a lot.",
};

export const TotalAwards = (props: any) => {
  return (
    <WrappedContainer>
      <p className="text-2xl text-lightGray">
        In {CURR_YEAR}, <b className="text-white">{props.team}</b> has been
        to...
      </p>
      <h1 className="text-primary font-bold text-7xl mt-[-10px] animate-in slide-in-from-bottom fade-in duration-1000">
        <CountUp end={props.totalAwards} duration={2} /> awards
      </h1>
      <p className="text-2xl text-lightGray animate-in slide-in-from-bottom fade-in duration-1000">
        {lookup(props.totalAwards, comments)}
      </p>
    </WrappedContainer>
  );
};
