import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ErrorMessage } from "@/components/ErrorMessage";

export const AwardsTab = (props: any) => {
  const filteredAwards = props.teamAwards.filter(
    (award: any) =>
      award.name.includes("Winner") ||
      award.name.includes("Winners") ||
      award.name.includes("Impact Award") ||
      award.name.includes("Chairman's Award") ||
      award.name.includes("Woodie Flowers")
  );

  return (
    <div className="flex flex-col mt-5">
      {props.teamAwards.length > 0 ? (
        <>
          <div className="flex flex-wrap md:flex-row gap-3">
            <AnimatePresence>
              {filteredAwards
                .reverse()
                .slice(0, props.showAll ? props.teamAwards.length : 20)
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
                          priority={true}
                          alt="FIRST Logo"
                        />
                      </div>
                      <Link href={`/event/${award.event_key.toLowerCase()}`}>
                        <div className="award-name mt-3 mb-3 group text-black dark:text-white">
                          <span className="text-xs group-hover:text-primary">
                            {award.event_key.substring(4).toUpperCase()}
                          </span>{" "}
                          <br />
                          <span className="italic font-black group-hover:text-primary">
                            {award.name.replace("District", "")}
                          </span>
                        </div>
                      </Link>

                      <div className="award-event">{award.year}</div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>
          {filteredAwards.length > 20 && (
            <h1 className="text-lightGray italic font-semibold text-sm mb-5">
              {props.showAll
                ? ""
                : `(${
                    filteredAwards.length - 20
                  } more events won that aren't shown -`}{" "}
              <span
                onClick={() => props.setShowAll(!props.showAll)}
                className="text-black dark:text-white hover:text-primary hover:cursor-pointer"
              >
                {props.showAll ? "show less?" : "show all?"}
              </span>
              {!props.showAll && ")"}
            </h1>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {props.teamAwards
              .filter(
                (award: any) =>
                  !award.name.includes("Winner") &&
                  !award.name.includes("Winners") &&
                  !award.name.includes("Impact Award") &&
                  !award.name.includes("Chairman's Award") &&
                  !award.name.includes("Woodie Flowers")
              )
              .reverse()
              .map((award: any, key: number) => {
                return (
                  <a
                    key={key}
                    href={`https://frc-events.firstinspires.org/${
                      award.year
                    }/${award.event_key.substring(4)}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="rounded-lg px-5 py-5 border border-[#2A2A2A] bg-card hover:border-gray-600"
                  >
                    <h1 className="font-bold text-black dark:text-white">
                      {award.name}
                    </h1>
                    <p className="text-lightGray">{award.year}</p>
                  </a>
                );
              })}
          </div>
        </>
      ) : (
        <ErrorMessage
          message={` Looks like ${props.teamInfo.team_number} hasn't received any
        awards, yet.`}
        />
      )}
    </div>
  );
};
