import { EventData } from "@/components/EventData";
import { Footer } from "@/components/Footer";
import { TabButton } from "@/components/TabButton";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { FaTwitch } from "react-icons/fa";
import { convertDate, isLive } from "@/util/date";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { TeamScreen } from "@/components/headers/TeamScreen";
import { getStorage, setStorage } from "@/util/localStorage";
import { formatTime } from "@/util/time";
import { log } from "@/util/log";
import { Loading } from "@/components/Loading";
import Head from "next/head";
import { AwardsTab } from "@/components/tabs/team/Awards";
import { AboutTab } from "@/components/tabs/team/About";

async function fetchTeamData(team: string) {
  const teamData = getStorage(`team_${team}_${CURR_YEAR}`);
  const eventData = getStorage(`team_${team}_events`);

  if (teamData) {
    return {
      team: teamData,
      events: eventData,
    };
  }

  const start = performance.now();

  const fetchInfo = async () => {
    const [
      getTeam,
      teamAvatar,
      teamSocials,
      teamAwards,
      yearsParticipated,
      teamDistrict,
    ] = await Promise.all([
      await fetch(`${API_URL}/api/team?team=${team}`, {
        next: { revalidate: 60 },
      }),
      await fetch(`${API_URL}/api/team/avatar?team=${team}`, {
        next: { revalidate: 60 },
      }),
      await fetch(`${API_URL}/api/team/socials?team=${team}`, {
        next: { revalidate: 60 },
      }),
      await fetch(`${API_URL}/api/team/awards?team=${team}`, {
        next: { revalidate: 60 },
      }),
      await fetch(`${API_URL}/api/team/years?team=${team}`, {
        next: { revalidate: 60 },
      }),
      await fetch(`${API_URL}/api/team/districts?team=${team}`, {
        next: { revalidate: 60 },
      }),
    ]).then((responses) => Promise.all(responses.map((res) => res.json())));

    log(
      "warning",
      `Fetching [/team], [/team/${team}/...] took ${formatTime(
        performance.now() - start
      )}`
    );

    return {
      teamData: getTeam,
      teamAvatar: teamAvatar.avatar,
      teamSocials,
      teamAwards,
      teamDistrict,
      yearsParticipated: yearsParticipated.reverse(),
    };
  };

  const eventsData = await fetch(`${API_URL}/api/events?team=${team}`).then(
    (res) => res.json()
  );

  setStorage(
    `team_${team}_${CURR_YEAR}`,
    (await fetchInfo()) as unknown as string
  );
  setStorage(`team_${team}_events`, eventsData);
  return {
    team: await fetchInfo(),
    events: eventsData,
  };
}

export default function TeamPage() {
  const router = useRouter();
  const { team } = router.query;
  const [teamData, setTeamData] = useState<any>();
  const [activeTab, setActiveTab] = useState<any>(1);
  const [eventData, setEventData] = useState([]);
  const [matchData, setMatchData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      const data = (await fetchTeamData(team as string)).team;
      if (data) setTeamData(data);
    };

    fetchData();
  }, [team, router.isReady, teamData]);

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

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.addEventListener("click", () =>
        setIsDropdownOpen((prevState) => !prevState)
      );
    }
  }, [dropdownRef]);

  // const getEventData = useCallback(async () => {
  //   setLoading(true);
  //   const fetchEventData = await fetch(
  //     `${API_URL}/api/team/events?team=${team}&year=${activeTab}`
  //   ).then((res) => res.json());

  //   const eventMatchData: any = {};

  //   for (const event of fetchEventData) {
  //     const matchData = await fetch(
  //       `${API_URL}/api/events/matches?team=${team}&year=${activeTab}&event=${event.event_code}`
  //     ).then((res) => res.json());
  //     eventMatchData[event.event_code] = matchData;
  //   }
  //   setMatchData(eventMatchData);
  //   setEventData(fetchEventData);
  //   setLoading(false);
  // }, [team, activeTab]);

  // useEffect(() => {
  //   getEventData();
  // }, [getEventData]);

  if (!teamData) return <Loading />;

  const year = teamData.yearsParticipated
    ? teamData.yearsParticipated.map((year: any) => year)
    : [];

  return (
    <>
      <Head>
        <title>Team {teamData.teamData.team_number} | Scout Machine</title>
      </Head>

      <Navbar />

      <div className="flex flex-wrap items-center justify-center pl-8 pr-8 md:pl-0 md:pr-0">
        <TeamScreen
          team={teamData.teamData}
          socials={teamData.teamSocials}
          avatar={teamData.teamAvatar}
          district={teamData.teamDistrict}
        />

        <div className="md:pl-8 md:pr-8 w-full">
          <div className="bg-gray-800 rounded-lg px-10 py-10 flex flex-col max-w-screen-3xl mt-10">
            <div className="flex flex-wrap gap-4">
              <TabButton
                active={activeTab}
                tab={1}
                onClick={() => setActiveTab(1)}
              >
                About
              </TabButton>
              <TabButton
                active={activeTab}
                tab={2}
                onClick={() => setActiveTab(2)}
              >
                Awards{" "}
                <span className="bg-gray-600 py-[1px] px-2 ml-1 rounded-full border-2 border-gray-500">
                  {teamData.teamAwards.length}
                </span>
              </TabButton>
              <div className="relative" ref={dropdownRef}>
                <div
                  className={`bg-gray-700 w-[300px] text-white  ${
                    isDropdownOpen
                      ? "rounded-t-lg border-2 border-b-gray-500 border-transparent"
                      : "rounded-lg"
                  } px-5 py-2 flex items-center justify-between cursor-pointer`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                  {teamData.yearsParticipated.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {teamData.yearsParticipated.map((year: any, key: any) => (
                        <div
                          key={key}
                          className=" cursor-pointer bg-gray-600 hover:bg-gray-500 hover:cursor-pointer py-1 px-3 rounded-lg border border-gray-500"
                          onClick={() => {
                            setActiveTab(Number(year));
                            setIsDropdownOpen(false);
                          }}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-2 text-gray-400">
                      Looks like {teamData.team_number} hasn&apos;t competed,
                      yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {loading && ![1, 2].includes(activeTab) && (
              <p className="text-gray-400 mt-5">Loading...</p>
            )}

            {activeTab === 1 && <AboutTab team={teamData} />}

            {activeTab === 2 && (
              <AwardsTab
                team={teamData}
                showAll={showAll}
                setShowAll={setShowAll}
              />
            )}

            <div className="flex flex-col gap-5 mt-5">
              {year.includes(activeTab) &&
                eventData
                  .sort((a: any, b: any) => {
                    const aTimestamp = new Date(a.start_date).getTime();
                    const bTimestamp = new Date(b.start_date).getTime();
                    return bTimestamp - aTimestamp;
                  })
                  .map((event: any, key: number) => {
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
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
