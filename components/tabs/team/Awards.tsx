import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FaMedal } from "react-icons/fa";
import Image from "next/image";

export const AwardsTab = (props: any) => {
  const filteredAwards = props.team.teamAwards.filter(
    (award: any) =>
      award.name.includes("Winner") || award.name.includes("Impact Award")
  );

  return (
    <div className="flex flex-col mt-5">
      {props.team.teamAwards.length > 0 ? (
        <>
          <div className="md:grid sm:grid-cols-4 lg:grid-cols-7 grid-cols-10 gap-4">
            <AnimatePresence>
              {filteredAwards
                .reverse()
                .slice(0, props.showAll ? props.team.teamAwards.length : 14)
                .sort(
                  (teamAwardA: any, teamAwardB: any) =>
                    parseInt(teamAwardB.year) - parseInt(teamAwardA.year)
                )
                .map((award: any, key: number) => {
                  return (
                    <motion.div
                      className="banner"
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center justify-center mt-3">
                        <Image
                          src="/first-icon.svg"
                          height="50"
                          width="50"
                          alt="FIRST Logo"
                        />
                      </div>
                      <Link href={`/events/${award.event_key}`} legacyBehavior>
                        <a>
                          <div className="award-name mt-5 mb-3">
                            <span className="italic font-black text-white">
                              {award.name}
                            </span>{" "}
                          </div>
                        </a>
                      </Link>

                      <div className="award-event">{award.year}</div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
          {filteredAwards.length > 14 && (
            <h1 className="text-gray-400 italic font-semibold text-sm mt-[-15px] mb-5">
              {props.showAll
                ? ""
                : `(${
                    filteredAwards.length - 14
                  } more events won that aren't shown -`}{" "}
              <span
                onClick={() => props.setShowAll(!props.showAll)}
                className="text-primary hover:text-white hover:cursor-pointer"
              >
                {props.showAll ? "show less?" : "show all?"}
              </span>
              {!props.showAll && ")"}
            </h1>
          )}

          <div className="md:grid md:grid-cols-4 gap-4">
            {props.team.teamAwards
              .filter(
                (award: any) =>
                  !award.name.includes("Winner") &&
                  !award.name.includes("Impact Award")
              )
              .sort(
                (teamAwardA: any, teamAwardB: any) =>
                  parseInt(teamAwardB.year) - parseInt(teamAwardA.year)
              )
              .map((award: any, key: number) => {
                return (
                  <a
                    key={key}
                    href={`https://frc-events.firstinspires.org/${
                      award.year
                    }/${award.event_key.slice(4)}`}
                    target="_blank"
                    className="bg-gray-700 rounded-lg px-5 py-5 hover:bg-gray-600 border-2 border-gray-500"
                  >
                    <div className="flex">
                      {award.name.includes("Winner") && (
                        <FaMedal className="text-xl mr-2 text-[#ecc729]" />
                      )}
                      <h1 className="font-bold text-gray-300 mt-[-5px]">
                        {award.name}
                      </h1>
                    </div>
                    <p className="text-gray-400 mt-3">{award.year}</p>
                  </a>
                );
              })}
          </div>
        </>
      ) : (
        <p className="text-gray-400">
          Looks like {props.team.team_number} hasn&apos;t received any awards
          yet.
        </p>
      )}
    </div>
  );
};
