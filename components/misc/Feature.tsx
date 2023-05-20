import { NextRouter, useRouter } from "next/router";
import { FC } from "react";

interface FeatureProps {
  name: string;
  href?: string;
}

export const Feature: FC<FeatureProps> = (props: FeatureProps) => {
  const router: NextRouter = useRouter();

  return (
    <div
      onClick={() => router.push(props.href as string)}
      className={`rounded-full bg-card hover:border-gray-600 select-none cursor-auto text-sm text-lightGray hover:text-white transition-all duration-150 py-2 px-4 border border-[#2A2A2A] text-center flex items-center justify-center ${
        props.href ? "cursor-pointer" : ""
      }`}
    >
      {props.name}
    </div>
  );
};
