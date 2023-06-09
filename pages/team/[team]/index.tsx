import { EventData } from "@/components/eventdata";
import { Footer } from "@/components/Footer";
import { TabButton } from "@/components/TabButton";
import { API_URL } from "@/lib/constants";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp, FaTwitch } from "react-icons/fa";
import { convertDate, isLive } from "@/utils/date";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { TeamScreen } from "@/components/screens/TeamScreen";
import { AboutTab } from "@/components/tabs/team/About";
import { AwardsTab } from "@/components/tabs/team/Awards";
import { ErrorMessage } from "@/components/ErrorMessage";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { TeamMembersTab } from "@/components/tabs/team/TeamMembers";
import { EventsTab } from "@/components/tabs/team/Events";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session, getServerSession, User } from "next-auth";
import db from "@/lib/db";
import { FavouritedTeam } from "@prisma/client";
import { SEO } from "@/components/SEO";

export const SubInfo = (props: any) => {
  return (
    <span className="border border-[#2A2A2A] text-lightGray py-[3px] px-2 ml-1 rounded-full">
      {props.children}
    </span>
  );
};

export default function TeamPage({
  user,
  teamMembers,
  teamInfo,
  teamAvatar,
  teamAwards,
  teamSocials,
  teamEvents,
  yearsParticipated,
}: any) {
  const router: NextRouter = useRouter();
  const { team } = router.query;
  const [activeTab, setActiveTab] = useState<any>(1);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentYearTab, setCurrentYearTab] = useState();
  const [eventData, setEventData] = useState<any>();

  useEffect((): void => {
    const redirectToHome = async (): Promise<void> => {
      if (!teamInfo) {
        await router.push("/404");
      }
    };

    redirectToHome();
  }, [router, teamInfo]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return (): void => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownRef]);

  useEffect((): void => {
    if (!router.isReady) return;

    const getEventData = async (): Promise<void> => {
      setLoading(true);
      const fetchEventData = await fetch(
        `${API_URL}/api/teams/events?team=${team}&year=${activeTab}`
      ).then((res: Response) => res.json());

      setEventData(fetchEventData);
      setLoading(false);
    };

    if (activeTab.toString().length === 4) {
      getEventData();
    }
  }, [activeTab, router.isReady, team]);

  const toggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTabClick = (tabIndex: number): void => {
    setActiveTab(tabIndex);
  };

  const title: string = teamInfo
    ? `${teamInfo.team_number} / ${teamInfo.nickname} / Scout Machine`
    : `${team} / Scout Machine`;

  const description = `A FIRST Robotics Competition team from ${teamInfo.city}, ${teamInfo.state_prov}, ${teamInfo.country} competing since ${teamInfo.rookie_year}`;

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={`${API_URL}/api/og/image?team=${team}`}
      />

      <Navbar />

      <div className="flex flex-wrap items-center justify-center pl-4 pr-4 md:pl-0 md:pr-0">
        <TeamScreen
          team={teamInfo}
          years={yearsParticipated}
          socials={teamSocials}
          avatar={teamAvatar}
          favouritedTeams={user?.favouritedTeams}
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
                Awards <SubInfo>{teamAwards?.length}</SubInfo>
              </TabButton>
              <TabButton
                active={activeTab}
                tab={4}
                onClick={() => setActiveTab(4)}
              >
                Events <SubInfo>{teamEvents.length}</SubInfo>
              </TabButton>
              <TabButton
                active={activeTab}
                tab={3}
                onClick={() => setActiveTab(3)}
              >
                Team Members <SubInfo>{teamMembers.length}</SubInfo>
              </TabButton>
              <div className="group relative">
                <TabButton
                  className={`${
                    isDropdownOpen ? "rounded-t-lg" : "rounded-lg"
                  }`}
                  active={activeTab}
                  onClick={toggleDropdown}
                  tab={0}
                >
                  <div className="flex">
                    {String(activeTab).length >= 4 ? (
                      `${activeTab} Season`
                    ) : (
                      <span>
                        Select a Season{" "}
                        <SubInfo>{yearsParticipated.length}</SubInfo>{" "}
                      </span>
                    )}
                    <FaArrowUp
                      className={`transform text-lightGray group-hover:text-white transition-all duration-150 ml-10 mt-1 ${
                        isDropdownOpen ? "-rotate-180 text-white" : ""
                      }`}
                    />
                  </div>
                </TabButton>

                <div
                  className={`absolute right-0 left-0 bg-card text-white rounded-b-lg px-3 py-4 ${
                    isDropdownOpen ? "block" : "hidden"
                  } z-20`}
                >
                  {yearsParticipated.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {yearsParticipated.map((year: any, key: number) => (
                        <div
                          key={key}
                          className="cursor-pointer text-lightGray hover:text-white bg-card border border-[#2A2A2A] hover:cursor-pointer py-1 px-3 rounded-lg"
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
                      Looks like {teamInfo?.team_number} hasn&apos;t competed
                      yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {loading && (
              <p className="text-gray-400 mt-5">
                Loading {activeTab} Season...
              </p>
            )}

            {activeTab === 1 && (
              <AboutTab
                teamInfo={teamInfo}
                teamEvents={teamEvents}
                teamAwards={teamAwards}
                yearsParticipated={yearsParticipated}
              />
            )}

            {activeTab === 2 && (
              <AwardsTab
                teamInfo={teamInfo}
                teamAwards={teamAwards}
                showAll={showAll}
                setShowAll={setShowAll}
              />
            )}

            {activeTab === 3 && (
              <TeamMembersTab members={teamMembers} team={teamInfo} />
            )}

            {activeTab === 4 && <EventsTab events={teamEvents} />}

            <div className="flex flex-col gap-5">
              {yearsParticipated.includes(activeTab) &&
                eventData &&
                eventData.teamEvents &&
                !loading &&
                eventData.teamEvents
                  .sort((a: any, b: any) => {
                    const aTimestamp: number = new Date(a.start_date).getTime();
                    const bTimestamp: number = new Date(b.start_date).getTime();
                    return bTimestamp - aTimestamp;
                  })
                  .map((event: any, key: number) => {
                    const allEventMatches = eventData.eventMatches.filter(
                      (match: any) => match.event_key === event.key
                    );

                    const playlists: any = {};

                    eventData.teamEvents.forEach((event: any): void => {
                      const eventCode = event.event_code;

                      allEventMatches.forEach((match: any): void => {
                        if (!playlists[eventCode]) {
                          playlists[eventCode] = [];
                        }
                        if (match.videos) {
                          match.videos
                            .filter(
                              (video: any): boolean => video.type === "youtube"
                            )
                            .forEach((video: any): void => {
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
                            <Link href={`/event/${event.key}`} legacyBehavior>
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

                        {allEventMatches.length === 0 ? (
                          <ErrorMessage message="Looks like there's no data available for this event!" />
                        ) : (
                          <EventData
                            data={allEventMatches}
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<any> => {
  const { team }: any = context.params;
  const session: Session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;

  const {
    teamInfo,
    teamAvatar,
    teamAwards,
    teamSocials,
    teamMembers,
    yearsParticipated,
    teamEvents,
  } = await fetch(`${API_URL}/api/teams?team=${team}`, {
    next: {
      revalidate: 3600,
    },
  }).then((res: Response) => res.json());

  if (teamInfo) {
    if (session) {
      const user: (User & { favouritedTeams: FavouritedTeam[] }) | null =
        await db.user.findUnique({
          where: {
            id: session.user.id,
          },
          include: {
            favouritedTeams: true,
          },
        });

      return {
        props: {
          user: JSON.parse(JSON.stringify(user)),
          teamInfo,
          teamAvatar: teamAvatar.avatar,
          teamAwards,
          teamMembers,
          teamSocials,
          teamEvents: teamEvents.reverse(),
          yearsParticipated: yearsParticipated.reverse(),
        },
      };
    }
    return {
      props: {
        teamInfo,
        teamAvatar: teamAvatar.avatar,
        teamAwards,
        teamMembers,
        teamSocials,
        teamEvents: teamEvents.reverse(),
        yearsParticipated: yearsParticipated.reverse(),
      },
    };
  }

  return {
    props: {
      teamInfo: [],
    },
  };
};
