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
    <div
      className={`${props.className} bg-card hover:text-white transition-all duration-150 ${
        props.active === props.tab ? "text-white" : "text-lightGray"
      } font-semibold rounded-lg`}
    >
      <div className="bg-gradient-to-b from-[#191919] to-card drop-shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.25)] rounded-lg">
        <button
          onClick={props.onClick}
          className={`bg-card px-5 py-2 ${props.className ?? 'rounded-lg'}`}
        >
          {props.children}
        </button>
      </div>
    </div>
  );
};
