import { ReactNode } from "react";

interface Props {
  onClick: () => void;
  active: number;
  tab: number;
  children: ReactNode;
}

export const TabButton = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`px-5 py-2 rounded-lg font-semibold ${
        props.active === props.tab
          ? "bg-gray-600 text-white"
          : "text-gray-400 bg-gray-700 hover:bg-gray-600 hover:text-white"
      }`}
    >
      {props.children}
    </button>
  );
};
