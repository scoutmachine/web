import dynamic from "next/dynamic";
import { WrappedContainer } from "../WrappedContainer";
import { CURR_YEAR } from "@/lib/constants";
import lookup from "@/utils/lookup";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

const comments = {
  0: "Not a single one?",
  1: "Just one?",
  20: "Looks like the season hasn't been busy, maybe next year?",
  30: "You've been up to something.",
  40: "You're learning...",
  50: "Master of Robots",
  60: "Time to take a break...",
};

export const TotalMatches = (props: any) => {
  return (
    <WrappedContainer>
      <p className="text-2xl text-lightGray">
        In {CURR_YEAR}, <b className="text-white">{props.team}</b> has played...
      </p>
      <h1 className="text-primary font-bold text-7xl mt-[-10px] animate-in slide-in-from-bottom fade-in duration-1000">
        <CountUp end={props.teamMatches.length} duration={2} /> matches
      </h1>
      <p className="text-2xl text-lightGray animate-in slide-in-from-bottom fade-in duration-1000">
        {lookup(props.teamMatches.length, comments)}
      </p>
    </WrappedContainer>
  );
};
