import { ErrorMessage } from "@/components/ErrorMessage";
import { EventData } from "@/components/eventdata";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { TabButton } from "@/components/TabButton";
import { EventHeader } from "@/components/headers/EventHeader";
import { AlliancesTab } from "@/components/tabs/event/Alliances";
import { TeamsTab } from "@/components/tabs/event/Teams";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";
import Head from "next/head";
import { Loading } from "@/components/Loading";
import db from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession, Session, User } from "next-auth";
import { AwardsTab } from "@/components/tabs/event/Awards";
import { FavouritedTeam } from "@prisma/client";
import router from "next/router";

export default function EventsPage({
  matches,
  eventInfo,
  eventTeams,
  eventAlliances,
  eventAwards,
  matchEPAs,
  user,
}: any) {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleTabClick = (tabIndex: number): void => {
    setActiveTab(tabIndex);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Head>
        <title>{eventInfo.name} | Scout Machine</title>
      </Head>

      <Navbar />

      <div className="flex flex-wrap items-center justify-center mt-10 pl-4 pr-4 md:pr-8 md:pl-8">
        <EventHeader event={eventInfo} teams={eventTeams} />

        <div className="pr-4 pl-4 md:pr-0 md:pl-0 w-full max-w-screen-3xl flex justify-center">
          <div className="border border-[#2a2a2a] bg-[#191919] rounded-lg px-10 py-10 flex flex-col mt-5 w-full">
            <div className="flex flex-wrap gap-5">
              <TabButton
                active={activeTab}
                tab={1}
                onClick={() => handleTabClick(1)}
              >
                Results
              </TabButton>
              {eventAlliances && (
                <TabButton
                  active={activeTab}
                  tab={2}
                  onClick={() => handleTabClick(2)}
                >
                  Alliances
                </TabButton>
              )}
              <TabButton
                active={activeTab}
                tab={3}
                onClick={() => handleTabClick(3)}
              >
                Rankings
              </TabButton>
              <TabButton
                active={activeTab}
                tab={4}
                onClick={() => handleTabClick(4)}
              >
                Awards
              </TabButton>
              <TabButton
                active={activeTab}
                tab={5}
                onClick={() => handleTabClick(5)}
                className="group"
              >
                Teams{" "}
                <span className="border border-[#2A2A2A] text-lightGray py-[3px] px-2 ml-1 rounded-full">
                  {eventTeams.length}
                </span>
              </TabButton>
            </div>

            {activeTab === 1 &&
              (matches.length > 0 ? (
                <EventData
                  data={matches}
                  isTeam={false}
                  setLoading={setLoading}
                  matchEPAs={matchEPAs}
                />
              ) : (
                <ErrorMessage message="Looks like there's no data available for this event!" />
              ))}

            {eventAlliances && activeTab == 2 && (
              <AlliancesTab alliances={eventAlliances} />
            )}

            {activeTab == 3 && (
              <p className="text-lightGray mt-5">Coming soon!</p>
            )}
            {activeTab == 4 && <AwardsTab awards={eventAwards} />}

            {activeTab === 5 && (
              <TeamsTab teams={eventTeams} favourites={user?.favouritedTeams} />
            )}
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
  const { event }: any = context.params;

  const t1 = performance.now();

  const session: Session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;

  const t2 = performance.now();

  console.log(`Took ${t2 - t1}ms to get session`);

  const [matches, eventInfo, eventTeams, eventAlliances] = await Promise.all([
    fetch(`${API_URL}/api/v2/event/matches?event=${event}`).then((res) =>
      res.json()
    ),
    db.event.findUnique({
      where: {
        key: String(event),
      },
    }),
    fetch(`${API_URL}/api/events/infoTeams?event=${event}`).then((res) =>
      res.json()
    ),
    fetch(`${API_URL}/api/events/alliances?event=${event}`).then((res) =>
      res.json()
    ),
  ]);
  // const matches = await fetch(
  //   `${API_URL}/api/v2/event/matches?event=${event}`
  // ).then((res) => res.json());

  const t3 = performance.now();

  console.log(`Took ${t3 - t2}ms to get matches`);

  // const eventInfo = await ;

  const t4 = performance.now();

  console.log(`Took ${t4 - t3}ms to get event info`);

  // const eventTeams = await fetch(
  //   `${API_URL}/api/events/infoTeams?event=${event}`
  // ).then((res: Response) => res.json());

  const t5 = performance.now();

  console.log(`Took ${t5 - t4}ms to get event teams`);

  // const eventAlliances = await fetch(
  //   `${API_URL}/api/events/alliances?event=${event}`
  // )
  //   .then((res: Response) => res.json())
  //   .catch((): null => null);

  const t6 = performance.now();

  console.log(`Took ${t6 - t5}ms to get event alliances`);

  // const eventAwards = await fetch(
  //   `${API_URL}/api/events/awards?event=${event.substring(4)}`
  // ).then((res: Response) => res.json());

  const t7 = performance.now();

  console.log(`Took ${t7 - t6}ms to get event awards`);

  if (session) {
    const user: (User & { favouritedTeams: FavouritedTeam[] }) | null =
      await db.user.findUnique({
        where: {
          // @ts-ignore
          id: session.user.id,
        },
        include: {
          favouritedTeams: true,
        },
      });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        matches,
        eventInfo,
        eventTeams,
        eventAlliances,
        eventAwards: [],
      },
    };
  }

  return {
    props: {
      matches,
      eventInfo,
      eventTeams,
      eventAlliances,
      eventAwards: [],
    },
  };
};
