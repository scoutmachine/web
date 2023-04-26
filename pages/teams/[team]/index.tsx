import { EventData } from "@/components/EventData";
import { Footer } from "@/components/Footer";
import { TabButton } from "@/components/TabButton";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { FaMedal, FaTwitch } from "react-icons/fa";
import { convertDate, isLive } from "@/util/date";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import { TeamScreen } from "@/components/headers/TeamScreen";

export default function TeamPage({
  teamData,
  teamAvatar,
  teamSocials,
  teamAwards,
  yearsParticipated,
  teamDistrict,
}: any) {
  const [activeTab, setActiveTab] = useState<any>(1);
  const [eventData, setEventData] = useState([]);
  const [matchData, setMatchData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const year = yearsParticipated
    ? yearsParticipated.map((year: any) => year)
    : [];
  const router = useRouter();
  const { team } = router.query;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filteredAwards = teamAwards.filter(
    (award: any) =>
      award.name.includes("Winner") || award.name.includes("Impact Award")
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const getEventData = useCallback(async () => {
    setLoading(true);
    const fetchEventData = await fetch(
      `${API_URL}/api/team/events?team=${team}&year=${activeTab}`
    ).then((res) => res.json());

    const eventMatchData: any = {};

    for (const event of fetchEventData) {
      const matchData = await fetch(
        `${API_URL}/api/events/matches?team=${team}&year=${activeTab}&event=${event.event_code}`
      ).then((res) => res.json());
      eventMatchData[event.event_code] = matchData;
    }
    setMatchData(eventMatchData);
    setEventData(fetchEventData);
    setLoading(false);
  }, [team, activeTab]);

  useEffect(() => {
    getEventData();
  }, [getEventData]);

  const sortedEventData = eventData.sort((a: any, b: any) => {
    const aTimestamp = new Date(a.start_date).getTime();
    const bTimestamp = new Date(b.start_date).getTime();
    return bTimestamp - aTimestamp;
  });

  return (
    <>
      <Navbar />

      <div className="flex flex-wrap items-center justify-center pl-8 pr-8 md:pl-0 md:pr-0">
        <TeamScreen
          team={teamData}
          socials={teamSocials}
          avatar={teamAvatar}
          district={teamDistrict}
        />

        <div className="relative bg-gray-800 rounded-lg py-10 px-10 md:w-[1100px] mt-8">
          <div className="flex flex-wrap gap-4">
            <TabButton
              active={activeTab}
              tab={1}
              onClick={() => handleTabClick(1)}
            >
              Awards{" "}
              <span className="bg-gray-600 py-[1px] px-2 ml-1 rounded-full border-2 border-gray-500">
                {teamAwards.length}
              </span>
            </TabButton>
            <div className="relative" ref={dropdownRef}>
              <div
                className={`bg-gray-700 w-[300px] text-white  ${
                  isDropdownOpen
                    ? "rounded-t-lg border-2 border-b-gray-500 border-transparent"
                    : "rounded-lg"
                } px-5 py-2 flex items-center justify-between cursor-pointer`}
                onClick={toggleDropdown}
              >
                <span className="font-bold">
                  {String(activeTab).length >= 4
                    ? `${activeTab} Season`
                    : "Select a Season"}
                </span>
                <svg
                  className={`h-5 w-5 transform ${
                    isDropdownOpen ? "-rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 1 1-1.414 1.414L11 5.414V14a1 1 0 1 1-2 0V5.414L6.707 7.707a1 1 0 0 1-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className={`absolute right-0 left-0 bg-gray-700 text-white rounded-b-lg px-3 py-4 ${
                  isDropdownOpen ? "block" : "hidden"
                } z-20`}
              >
                {yearsParticipated.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {yearsParticipated.map((year: any, key: any) => (
                      <div
                        key={key}
                        className=" cursor-pointer bg-gray-600 hover:bg-gray-500 hover:cursor-pointer py-1 px-3 rounded-lg border border-gray-500"
                        onClick={() => {
                          handleTabClick(Number(year));
                          setIsDropdownOpen(false);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="px-2 text-gray-400">
                    Looks like {teamData.team_number} hasn&apos;t competed, yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-5">
            {activeTab === 1 &&
              (teamAwards.length > 0 ? (
                <>
                  <div className="md:grid grid-cols-7">
                    <AnimatePresence>
                      {filteredAwards
                        .reverse()
                        .slice(0, showAll ? teamAwards.length : 14)
                        .sort(
                          (teamAwardA: any, teamAwardB: any) =>
                            parseInt(teamAwardB.year) -
                            parseInt(teamAwardA.year)
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
                              <Link
                                href={`/events/${award.event_key}`}
                                legacyBehavior
                              >
                                <a>
                                  <div className="award-name mt-5 mb-3">
                                    <span className="italic font-black text-white hover:text-primary">
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
                      {showAll
                        ? ""
                        : `(${
                            filteredAwards.length - 14
                          } more events won that aren't shown -`}{" "}
                      <span
                        onClick={() => setShowAll(!showAll)}
                        className="text-primary hover:text-white hover:cursor-pointer"
                      >
                        {showAll ? "show less?" : "show all?"}
                      </span>
                      {!showAll && ")"}
                    </h1>
                  )}

                  <div className="md:grid md:grid-cols-4 gap-4">
                    {teamAwards
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
                  Looks like {teamData.team_number} hasn&apos;t received any
                  awards yet.
                </p>
              ))}
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="flex flex-col gap-5">
              {year.includes(activeTab) &&
                sortedEventData.map((event: any, key: number) => {
                  return (
                    <div
                      key={key}
                      className="bg-gray-700 flex-wrap md:w-full w-[300px] rounded-lg px-8 py-5"
                    >
                      <div className="flex justify-between">
                        <div>
                          <Link href={`/events/${event.key}`} legacyBehavior>
                            <a>
                              <h1
                                className="font-black text-primary text-2xl hover:text-white"
                                key={key}
                              >
                                {event.name}
                              </h1>
                            </a>
                          </Link>
                          <a href={event.gmaps_url} target="_blank">
                            <p className="text-gray-400 hover:text-white">
                              {event.location_name &&
                                `${event.location_name}, ${event.city}, ${event.country}`}
                            </p>
                          </a>
                          <span className="text-md text-gray-400">
                            {convertDate(event.start_date)} -{" "}
                            {convertDate(event.end_date)}, {activeTab}
                          </span>
                          <div className="md:hidden block mt-5">
                            {isLive(event.start_date, event.end_date) <=
                              event.end_date &&
                              event.webcasts.length > 0 && (
                                <a
                                  href={`https://twitch.tv/${event.webcasts[0].channel}`}
                                  target="_blank"
                                >
                                  <div className="flex bg-[#6441a5] text-white hover:bg-white hover:text-primary py-1 px-5 rounded-lg font-bold">
                                    <FaTwitch className="text-md mt-1 mr-2" />{" "}
                                    {event.webcasts[0].channel}
                                  </div>
                                </a>
                              )}
                          </div>
                        </div>
                        <div className="md:block hidden">
                          {isLive(event.start_date, event.end_date) &&
                            event.webcasts.length > 0 && (
                              <a
                                href={`https://twitch.tv/${event.webcasts[0].channel}`}
                                target="_blank"
                              >
                                <div className="flex bg-[#6441a5] text-white hover:bg-gray-600 hover:text-primary py-1 px-5 rounded-lg font-bold">
                                  <FaTwitch className="text-md mt-1 mr-2" />{" "}
                                  {event.webcasts[0].channel}
                                </div>
                              </a>
                            )}
                        </div>
                      </div>

                      {matchData[event.event_code].length === 0 ? (
                        <p className="text-red-400 mt-5 font-bold py-3 px-5 rounded-lg border-2 border-red-500">
                          Looks like there&apos;s no data available for this
                          event! 😔{" "}
                        </p>
                      ) : (
                        <EventData
                          data={matchData[event.event_code]}
                          team={team}
                          isTeam={true}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { team }: any = context.params;

  const teamData = await fetch(`${API_URL}/api/team?team=${team}`).then((res) =>
    res.json()
  );
  const teamAvatar = await fetch(
    `${API_URL}/api/team/avatar?team=${team}`
  ).then((res) => res.json());
  const teamSocials = await fetch(
    `${API_URL}/api/team/socials?team=${team}`
  ).then((res) => res.json());

  const teamAwards = await fetch(
    `${API_URL}/api/team/awards?team=${team}`
  ).then((res) => res.json());

  const yearsParticipated = await fetch(
    `${API_URL}/api/team/years?team=${team}`
  ).then((res) => res.json());

  const teamDistrict = await fetch(
    `${API_URL}/api/team/districts?team=${team}`
  ).then((res) => res.json());

  return {
    props: {
      teamData,
      teamAvatar: teamAvatar.avatar,
      teamSocials,
      teamAwards,
      teamDistrict,
      yearsParticipated: yearsParticipated.reverse(),
    },
  };
};