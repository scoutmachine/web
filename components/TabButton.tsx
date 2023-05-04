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
      className={`${props.className} px-5 py-2 rounded-lg font-semibold ${
        props.active === props.tab
          ? "dark:bg-card border dark:border-[#2A2A2A] text-white"
          : "text-lightGray dark:bg-card hover:border hover:border-[#2A2A2A] hover:text-lightGray"
      }`}
    >
      {props.children}
    </button>
  );
};
