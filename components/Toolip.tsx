import { useState } from "react";
import Tippy from "@tippyjs/react";
import Image from "next/image";

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
                  alt={`Team ${props.team.team_number} Avatar`}
                  height="25"
                  width="25"
                  priority={true}
                  src={
                    props.avatar
                      ? `data:image/jpeg;base64,${props.avatar}`
                      : "/first-icon.svg"
                  }
                />
              </div>
              <p className="text-center text-white">
                <span className="font-bold">Team {props.team.team_number}</span>{" "}
                is {props.team.school_name && `from ${props.team.school_name}`}{" "}
                located in {props.team.city}, {props.team.state_prov},{" "}
                {props.team.country} competing with{" "}
                <span className="italic">FIRST</span> since{" "}
                {props.team.rookie_year}
              </p>
            </>
          )
        }
        className={`tooltip border border-gray-700 bg-card py-3 px-3 rounded-lg text-white ${
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
