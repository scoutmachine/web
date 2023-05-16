import { EventData } from "@/components/EventData";
import { Footer } from "@/components/Footer";
import { TabButton } from "@/components/TabButton";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { FaArrowUp, FaTwitch } from "react-icons/fa";
import { convertDate, isLive } from "@/utils/date";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { TeamScreen } from "@/components/screens/TeamScreen";
import { getStorage, setStorage } from "@/utils/localStorage";
import { formatTime } from "@/utils/time";
import { log } from "@/utils/log";
import { Loading } from "@/components/Loading";
import { AboutTab } from "@/components/tabs/team/About";
import { AwardsTab } from "@/components/tabs/team/Awards";
import Head from "next/head";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Session, getServerSession } from "next-auth";
import { GetServerSideProps } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import db from "@/lib/db";
import { TeamMembersTab } from "@/components/tabs/team/TeamMembers";

const SubInfo = (props: any) => {
  return (
    <span className="border border-[#2A2A2A] text-lightGray py-[3px] px-2 ml-1 rounded-full">
      {props.children}
    </span>
  );
};

async function fetchTeamData(team: string) {
  const teamData = getStorage(`team_${team}_${CURR_YEAR}`);

  if (teamData) {
    return teamData;
  }

  const start = performance.now();

  const fetchInfo = async () => {
    const [getTeam, teamAvatar, teamSocials, yearsParticipated, teamDistrict] =
      await Promise.all([
        await fetch(`${API_URL}/api/team?team=${team}`, {
          next: { revalidate: 60 },
        }),
        await fetch(`${API_URL}/api/team/avatar?team=${team}`, {
          next: { revalidate: 60 },
        }),
        await fetch(`${API_URL}/api/team/socials?team=${team}`, {
          next: { revalidate: 60 },
        }),
        await fetch(`${API_URL}/api/team/years?team=${team}`, {
          next: { revalidate: 60 },
        }),
        await fetch(`${API_URL}/api/team/stats?team=${team}`, {
          next: { revalidate: 60 },
        }),
      ]).then((responses) => Promise.all(responses.map((res) => res.json())));

    const teamAwards = await fetch(
      `${API_URL}/api/team/awards?team=${team}&year=${yearsParticipated[0]}`,
      {
        next: { revalidate: 60 },
      }
    ).then((res) => res.json());

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

  setStorage(
    `team_${team}_${CURR_YEAR}`,
    (await fetchInfo()) as unknown as string
  );
  return await fetchInfo();
}

export default function TeamPage({ user, teamMembers }: any) {
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
  const [currentYearTab, setCurrentYearTab] = useState();

  useEffect(() => {
    if (!router.isReady) return;

    const fetchData = async () => {
      const data = await fetchTeamData(team as string);
      if (data) setTeamData(data);
    };

    const getEventData = async () => {
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
    };

    fetchData();
    getEventData();
  }, [activeTab, router.isReady, team]);

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

      <div className="flex flex-wrap items-center justify-center pl-4 pr-4 md:pl-0 md:pr-0">
        <TeamScreen
          team={teamData.teamData}
          socials={teamData.teamSocials}
          avatar={teamData.teamAvatar}
          district={teamData.teamDistrict}
          user={user}
        />

        <div className="md:pl-8 md:pr-8 w-full max-w-screen-3xl">
          <div className="border border-[#2a2a2a] bg-[#191919] rounded-lg px-10 py-10 flex flex-col mt-5">
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
                Awards <SubInfo>{teamData.teamAwards.length}</SubInfo>
              </TabButton>
              <TabButton
                active={activeTab}
                tab={3}
                onClick={() => setActiveTab(3)}
              >
                Team Members <SubInfo>{teamMembers.length}</SubInfo>
              </TabButton>
              <div className="relative" ref={dropdownRef}>
                <div
                  className={`group bg-card border border-[#2A2A2A] w-[300px] text-white  ${
                    isDropdownOpen
                      ? "rounded-t-lg border-2 border-b-[#2A2A2A] border-transparent"
                      : "rounded-lg border-b-[5px] border-[#2A2A2A]"
                  } px-5 py-2 flex items-center justify-between cursor-pointer active:translate-y-1  active:[box-shadow:0_0px_0_0_#19999,0_0px_0_0_#19999] active:border-b-[0px] transition-all duration-150 [box-shadow:0_10px_0_0_#19999,0_15px_0_0_#19999]`}
                  onClick={toggleDropdown}
                >
                  <span
                    className={`font-bold group-hover:text-white transition-all duration-150 ${
                      activeTab === currentYearTab
                        ? "text-white"
                        : "text-lightGray"
                    } ${isDropdownOpen && "text-white"}`}
                  >
                    {String(activeTab).length >= 4
                      ? `${activeTab} Season`
                      : "Select a Season"}
                  </span>
                  <FaArrowUp
                    className={`transform text-lightGray group-hover:text-white transition-all duration-150 ${
                      isDropdownOpen ? "-rotate-180 text-white" : ""
                    }`}
                  />
                </div>
                <div
                  className={`absolute right-0 left-0 bg-card text-white rounded-b-lg px-3 py-4 ${
                    isDropdownOpen ? "block" : "hidden"
                  } z-20`}
                >
                  {teamData.yearsParticipated.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {teamData.yearsParticipated.map((year: any, key: any) => (
                        <div
                          key={key}
                          className="transition-all duration-150 cursor-pointer text-lightGray hover:text-white bg-card border border-[#2A2A2A] hover:cursor-pointer py-1 px-3 rounded-lg"
                          onClick={() => {
                            handleTabClick(Number(year));
                            setIsDropdownOpen(false);
                            setCurrentYearTab(year);
                          }}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-2 text-lightGray">
                      Looks like {teamData.teamData.team_number} hasn&apos;t
                      competed, yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {loading && ![1, 2, 3].includes(activeTab) && (
              <p className="text-gray-400 mt-5">
                Loading {activeTab} Season...
              </p>
            )}

            {activeTab === 1 && <AboutTab team={teamData} />}

            {activeTab === 2 && (
              <AwardsTab
                team={teamData}
                showAll={showAll}
                setShowAll={setShowAll}
              />
            )}

            {activeTab === 3 && (
              <TeamMembersTab members={teamMembers} team={teamData.teamData} />
            )}

            <div className="flex flex-col gap-5">
              {year.includes(activeTab) &&
                eventData
                  .sort((a: any, b: any) => {
                    const aTimestamp = new Date(a.start_date).getTime();
                    const bTimestamp = new Date(b.start_date).getTime();
                    return bTimestamp - aTimestamp;
                  })
                  .map((event: any, key: number) => {
                    const playlists: any = {};

                    eventData.forEach((event: any) => {
                      const eventCode = event.event_code;

                      matchData[eventCode].forEach((match: any) => {
                        if (!playlists[eventCode]) {
                          playlists[eventCode] = [];
                        }
                        if (match.videos) {
                          match.videos
                            .filter((video: any) => video.type === "youtube")
                            .forEach((video: any) => {
                              if (video.key)
                                playlists[eventCode].push(video.key);
                            });
                        }
                      });
                    });

                    return (
                      <div
                        key={key}
                        className="border border-[#2A2A2A] bg-card mt-5 flex-wrap md:w-full rounded-lg px-8 py-5"
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
                            <a
                              href={event.gmaps_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <p className="text-lightGray hover:text-white">
                                {event.location_name &&
                                  `${event.location_name}, ${event.city}, ${event.country}`}
                              </p>
                            </a>
                            <span className="text-md text-lightGray">
                              {convertDate(event.start_date)} -{" "}
                              {convertDate(event.end_date)}, {activeTab}
                            </span>
                            <div className="md:hidden block mt-5">
                              {isLive(event.start_date, event.end_date) <=
                                event.end_date &&
                                event.webcasts.length > 0 && (
                                  <a
                                    href={`https://twitch.tv/${event.webcasts[0].channel}`}
                                    rel="noopener noreferrer"
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
                                  rel="noopener noreferrer"
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
                          <ErrorMessage message="Looks like there's no data available for this event!" />
                        ) : (
                          <EventData
                            data={matchData[event.event_code]}
                            team={team}
                            isTeam={true}
                            setLoading={setLoading}
                            event={event}
                            playlists={playlists}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;
  const { team }: any = context.params;

  if (session) {
    const user = await db.user.findUnique({
      where: {
        // @ts-ignore
        id: session.user.id,
      },
      include: {
        favourited: true,
      },
    });

    const teamMembers = await db.user.findMany({
      where: {
        teamNumber: Number(team),
      },
    });

    return { props: { user, teamMembers } };
  }

  return { props: {} };
};
