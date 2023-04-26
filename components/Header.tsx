import { isValidElement } from "react";

export const Header = (props: any) => {
  return (
    <div className="pr-8 pl-8 max-w-screen-3xl w-full">
      <div className="bg-gray-800 mt-10 rounded-lg px-10 py-10">
        <h1
          className={`${props.className} text-primary md:text-5xl text-3xl font-black mb-2`}
        >
          {props.title}{" "}
          <span
            className={`text-gray-400 ${isValidElement(props.title) && "ml-4"}`}
          >
            ─ Scout Machine
          </span>
        </h1>

        <p className="text-gray-400">{props.desc}</p>
        {props.children && props.children}
      </div>
    </div>
  );
};
