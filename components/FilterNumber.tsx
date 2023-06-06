import { ReactNode } from "react";

export const FilterNumber = (props: {
  range: string;
  reload?: boolean;
  name: ReactNode | string;
  setTeamNumberRange: (range: string) => void;
  setButtonClicked: any;
  buttonClicked: any;
}) => {
  return (
    <button
      onClick={(): void => {
        props.setButtonClicked(props.range);
        props.setTeamNumberRange(props.range);
      }}
      className={`${
        props.buttonClicked === props.range
          ? "border border-solid bg-gray-100 dark:bg-[#191919] text-white font-bold"
          : "bg-white dark:bg-card hover:bg-gray-100 dark:hover:bg-[#191919] hover:text-white"
      } px-3 py-1 text-lightGray text-sm rounded-lg border border-solid dark:border-[#2A2A2A] `}
    >
      {props.name}
    </button>
  );
};
