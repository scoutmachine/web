import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

export const AwardsTab = (props: { awards: any }) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
      {props.awards.map((award: any, key: number) => {
        return (
          <div
            key={key}
            className="rounded-lg px-5 py-5 border border-[#2A2A2A] bg-card hover:border-gray-600"
          >
            <a
              href={`https://frc-events.firstinspires.org/2023/awards?id=${award.awardId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold"
            >
              {award.name}
            </a>
            <div>
              <div className="text-lightGray inline-block">
                {award.person && (
                  <span className="flex mt-1">
                    <FaUserCircle className="mr-2 text-md mt-1" />
                    {award.person}
                  </span>
                )}

                <Link href={`/teams/${award.teamNumber}`}>
                  <p className="text-lightGray hover:text-primary inline-block">
                    Team {award.teamNumber}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
