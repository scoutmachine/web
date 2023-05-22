import { ReactNode, isValidElement } from "react";

export const Header = (props: {
  title: ReactNode | string;
  desc: ReactNode | string;
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div className="pl-4 pr-4 md:pr-8 md:pl-8 max-w-screen-3xl w-full">
      <div className="border bg-white border-solid dark:border-[#2a2a2a] dark:bg-[#191919] mt-10 rounded-lg px-10 py-10">
        <div className="md:flex text-primary md:text-5xl text-3xl font-black mb-2">
          {props.className ? (
            <>
              <h1 className={`${props.className}`}>{props.title} </h1>
              <span
                className={`text-black dark:text-white ${
                  isValidElement(props.title) && "md:ml-4"
                }`}
              >
                / Scout Machine
              </span>
            </>
          ) : (
            <h1>
              {props.title}{" "}
              <span
                className={`text-black dark:text-white ${
                  isValidElement(props.title) && "md:ml-4"
                }`}
              >
                / Scout Machine
              </span>
            </h1>
          )}
        </div>
        <h2 className="text-lightGray text-xl">{props.desc}</h2>
        {props.children && props.children}
      </div>
    </div>
  );
};
