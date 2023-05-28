import Link from "next/link";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

export const AwardsTab = (props: { awards: any }) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
      {props.awards.map((award: any, key: number) => {
        return (
          <div
            key={key}
            className="group rounded-lg px-5 py-5 border border-[#2A2A2A] bg-card hover:border-gray-600"
          >
            <h1 className="text-white font-bold">{award.name}</h1>

            <div>
              <div className="text-lightGray inline-block">
                {award.recipient_list.map((award: any, index: number) => (
                  <div className="mb-2 mt-1" key={index}>
                    {award.awardee && (
                      <span className="flex">
                        <FaUserCircle className="mr-2 text-md mt-1" />
                        {award.awardee}
                      </span>
                    )}
                  </div>
                ))}

                {award.recipient_list.map((team: any, index: number) => (
                  <React.Fragment key={index}>
                    <Link href={`/team/${team.team_key.substring(3)}`}>
                      <p className="text-lightGray group-hover:text-primary inline-block">
                        {index === 0 && "Team"}{" "}
                        {award.recipient_list.length > 1 &&
                          index === award.recipient_list.length - 1 &&
                          "&"}{" "}
                        {team.team_key.substring(3)}
                      </p>
                    </Link>
                    {index !== award.recipient_list.length - 1 && ", "}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
