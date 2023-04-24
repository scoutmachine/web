import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import Image from "next/image";
import { API_URL } from "@/lib/constants";

export const Tooltip = (props: any) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

 

  return (
    <div className="flex flex-col">
      <Tippy
        content={
          props.content ?? (
            <>
              <div className="flex items-center justify-center">
                <Image
                  className="rounded-lg mr-5 w-6 mb-2"
                  alt="FIRST Logo"
                  height="25"
                  width="25"
                  priority={true}
                  src={`/first-icon.svg`}
                />
              </div>
              <h1 className="text-center">
                <span className="font-bold">Team {props.team.team_number}</span>{" "}
                is {props.team.school_name && `from ${props.team.school_name}`}{" "}
                located in {props.team.city}, {props.team.state_prov},{" "}
                {props.team.country} competing with FIRST since{" "}
                {props.team.rookie_year} 
              </h1>
            </>
          )
        }
        className={`tooltip bg-gray-800 py-3 px-3 rounded-lg text-white ${
          isHovering ? "fade-in" : "fade-out"
        }`}
      >
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {props.children}
        </div>
      </Tippy>
    </div>
  );
};
