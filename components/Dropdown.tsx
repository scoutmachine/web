import { ReactNode } from "react";

export const Dropdown = (props: {
  item: ReactNode;
  state: boolean;
  children: ReactNode;
}) => {
  return (
    <div className={`relative inline-block dropdown`}>
      {props.item}
      <div
        className={`${
          props.state ? "block" : "hidden"
        } absolute top-full px-6 right-0 mt-3 border border-[#2A2A2A] bg-card rounded-lg z-10`}
      >
        {props.children}
      </div>
    </div>
  );
};
