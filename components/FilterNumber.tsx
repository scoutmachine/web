import router from "next/router";
import { ReactNode, useState } from "react";

export const FilterNumber = (props: {
  range: string;
  reload?: boolean;
  name: ReactNode | string;
  setTeamNumberRange: (range: string) => void;
}) => {
  const [buttonClicked, setButtonClicked] = useState("");

  return (
    <button
      onClick={(): void => {
        setButtonClicked(props.range);
        props.setTeamNumberRange(props.range);
        props.reload && router.reload();
      }}
      className={`${
        buttonClicked === props.range
          ? "bg-[#191919]"
          : "bg-card hover:bg-[#191919]"
      } px-3 py-1 text-lightGray text-sm rounded-lg border border-[#2A2A2A]`}
    >
      {props.name}
    </button>
  );
};
