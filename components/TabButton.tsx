import { ReactNode } from "react";

interface Props {
  onClick: () => void;
  active: number;
  tab: number;
  children: ReactNode;
  className?: string;
}

export const TabButton = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`${
        props.active === props.tab
          ? "text-white"
          : "text-lightGray hover:text-white"
      } bg-card font-semibold px-5 py-2 rounded-lg cursor-pointer select-none active:translate-y-1  active:[box-shadow:0_0px_0_0_#19999,0_0px_0_0_#19999] active:border-b-[0px] [box-shadow:0_10px_0_0_#19999,0_15px_0_0_#19999] border-b-[5px] border-[#2A2A2A]`}
    >
      {props.children}
    </button>
  );
};
