import { isValidElement } from "react";

export const Header = (props: any) => {
  return (
    <div className="pl-4 pr-4 md:pr-8 md:pl-8 max-w-screen-3xl w-full">
      <div className="border border-[#2a2a2a] bg-[#191919] mt-10 rounded-lg px-10 py-10">
        <h1
          className={`${props.className} text-primary md:text-5xl text-3xl font-black mb-2`}
        >
          {props.title}{" "}
          <span
            className={`text-lightGray ${
              isValidElement(props.title) && "ml-4"
            }`}
          >
            / Scout Machine
          </span>
        </h1>

        <h2 className="text-lightGray text-xl">{props.desc}</h2>
        {props.children && props.children}
      </div>
    </div>
  );
};
