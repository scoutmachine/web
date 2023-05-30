import { ErrorMessage } from "@/components/ErrorMessage";
import { EventData } from "@/components/eventdata";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { TabButton } from "@/components/TabButton";
import { EventHeader } from "@/components/headers/EventHeader";
import { AlliancesTab } from "@/components/tabs/event/Alliances";
import { TeamsTab } from "@/components/tabs/event/Teams";
import { MatchScout } from "@/components/tabs/event/MatchScout";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { JSX, useState } from "react";
import Head from "next/head";
import db from "@/lib/db";
import { AwardsTab } from "@/components/tabs/event/Awards";
import { useSession } from "next-auth/react";

export default function EventsPage({
  matches,
  eventInfo,
  eventTeams,
  eventAlliances,
  eventAwards,
  matchEPAs,
}: any): JSX.Element {
  const [activeTab, setActiveTab] = useState(1);
  const { data: session } = useSession();

  const handleTabClick = (tabIndex: number): void => {
    setActiveTab(tabIndex);
  };

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
              <TabButton
                active={activeTab}
                tab={6}
                onClick={() => handleTabClick(6)}
                className="group"
              >
                Match Scout
              </TabButton>
            </div>

            {activeTab === 1 &&
              (matches.length > 0 ? (
                <EventData
                  data={matches}
                  isTeam={false}
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
              <TeamsTab
                teams={eventTeams}
                // @ts-ignore
                favourites={session?.user?.favouritedTeams}
              />
            )}
            {activeTab === 6 && <MatchScout />}
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

  const [eventInfo, matches, eventAwards, eventTeams] = await Promise.all([
    await db.event.findUnique({
      where: {
        key: String(event),
      },
    }),
    await db.match.findMany({
      where: {
        event_key: String(event),
      },
    }),
    await db.event
      .findUnique({
        where: {
          key: String(event),
        },
      })
      .awards(),
    await db.event
      .findUnique({
        where: {
          key: String(event),
        },
      })
      .teams(),
  ]);

  return {
    props: {
      matches: JSON.parse(
        JSON.stringify(matches, (key: string, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      ),
      eventInfo,
      eventTeams,
      eventAlliances: [],
      eventAwards,
    },
  };
};
