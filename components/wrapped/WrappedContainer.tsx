import React, { ReactNode } from "react";

type WrappedContainerProps = {
  children: ReactNode;
  bg?: string;
  text?: string;
};

export const WrappedContainer = ({
  children,
  bg = "bg-card",
  text = "text-lightGray",
}: WrappedContainerProps) => {
  return (
    <div
      className={`w-screen min-h-screen flex justify-center items-center flex-col gap-6 text-center ${bg} ${text} p-6`}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}