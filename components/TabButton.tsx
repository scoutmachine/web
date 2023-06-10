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
          ? "text-white border-2 border-[#2A2A2A]"
          : "text-lightGray border border-[#2A2A2A]"
      } bg-card font-semibold px-5 py-2 rounded-lg cursor-pointer hover:text-white transition-all duration-150`}
    >
      {props.children}
    </button>
  );
};
