import router from "next/router";
import { useState } from "react";

export const FilterNumber = (props: any) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  return (
    <button
      onClick={() => {
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
