import { ErrorMessage } from "@/components/ErrorMessage";
import { EventData } from "@/components/eventdata";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { TabButton } from "@/components/TabButton";
import { EventHeader } from "@/components/headers/EventHeader";
import { AlliancesScreen } from "@/components/tabs/event/Alliances";
import { TeamsScreen } from "@/components/tabs/event/Teams";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import { useState } from "react";
import Head from "next/head";
import { Loading } from "@/components/Loading";
import db from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";

export default function EventsPage({
  matches,
  eventInfo,
  eventTeams,
  eventAlliances,
  matchEPAs,
  user,
}: any) {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleTabClick = (tabIndex: number) => {
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
              <AlliancesScreen alliances={eventAlliances} />
            )}

            {activeTab == 3 && (
              <p className="text-lightGray mt-5">Coming soon!</p>
            )}
            {activeTab == 4 && (
              <p className="text-lightGray mt-5">Coming soon!</p>
            )}

            {activeTab === 5 && (
              <TeamsScreen
                teams={eventTeams}
                favourites={user?.favouritedTeams}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { event }: any = context.params;

  const session = (await getServerSession(
    context.req,
    context.res,
    authOptions
  )) as Session;

  const matches = await fetch(
      `${API_URL}/api/events/event?event=${event}`
  ).then((res: Response) => res.json());

  const matchEPAs: any = {};

  const matchPromises = matches.map(async (match: any) => {
    try {
        const response: Response = await fetch(
            `${API_URL}/api/match/epa?match=${match.key}`
        );
      if (!response.ok) {
        throw new Error("Failed to fetch EPA data");
      }
      const data = await response.json();
      return { key: match.key, data };
    } catch (error) {
      return { key: match.key, data: null };
    }
  });

    const matchResults: PromiseSettledResult<any>[] = await Promise.allSettled(matchPromises);

    matchResults.forEach((result: any): void => {
        if (result.status === "fulfilled") {
            matchEPAs[result.value.key] = result.value.data;
        }
    });

    const eventInfo = await fetch(
        `${API_URL}/api/events/info?event=${event}`
    ).then((res: Response) => res.json());

    const eventTeams = await fetch(
        `${API_URL}/api/events/infoTeams?event=${event}`
    ).then((res: Response) => res.json());

    const eventAlliances = await fetch(
        `${API_URL}/api/events/alliances?event=${event}`
    )
        .then((res: Response) => res.json())
        .catch((): null => null);

  if (session) {
    const user = await db.user.findUnique({
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
        user,
        matches,
        eventInfo,
        eventTeams,
        eventAlliances,
        matchEPAs,
      },
    };
  }

  return {
    props: {
      matches,
      eventInfo,
      eventTeams,
      eventAlliances,
      matchEPAs,
    },
  };
};
