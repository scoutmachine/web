import { ErrorMessage } from "@/components/ErrorMessage";
import { EventData } from "@/components/EventData";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { TabButton } from "@/components/TabButton";
import { EventHeader } from "@/components/headers/EventHeader";
import { AlliancesScreen } from "@/components/tabs/event/Alliances";
import { TeamsScreen } from "@/components/tabs/event/Teams";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Event({
  matches,
  eventInfo,
  eventTeams,
  eventAlliances,
  eventRankings,
  eventAwards,
}: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-wrap items-center justify-center mt-10 pr-8 pl-8">
        <EventHeader event={eventInfo} teams={eventTeams} />

        <div className="flex justify-center">
          <div className="bg-gray-800 px-10 py-10 mt-5 rounded-lg md:w-[1100px] w-[350px]">
            <div className="flex gap-5">
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
                <span className="bg-gray-600 py-[1px] px-2 ml-1 rounded-full border-2 border-gray-500">
                  {eventTeams.length}
                </span>
              </TabButton>
            </div>

            {activeTab === 1 &&
              (matches.length > 0 ? (
                <EventData data={matches} isTeam={false} />
              ) : (
                <ErrorMessage message="Looks like there's no data available for this event! 😔" />
              ))}

            {eventAlliances && activeTab == 2 && (
              <AlliancesScreen alliances={eventAlliances} />
            )}

            {activeTab === 5 && (
              <TeamsScreen teams={eventTeams} />
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

  const matches = await fetch(
    `${API_URL}/api/events/event?event=${event}`
  ).then((res) => res.json());

  const eventInfo = await fetch(
    `${API_URL}/api/events/info?event=${event}`
  ).then((res) => res.json());

  const eventTeams = await fetch(
    `${API_URL}/api/events/infoTeams?event=${event}`
  ).then((res) => res.json());

  const eventAlliances = await fetch(
    `${API_URL}/api/events/alliances?event=${event}`
  )
    .then((res) => res.json())
    .catch(() => null);

  const eventRankings = await fetch(
    `${API_URL}/api/events/rankings?event=${event}`
  )
    .then((res) => res.json())
    .catch(() => null);

  const eventAwards = await fetch(`${API_URL}/api/events/awards?event=${event}`)
    .then((res) => res.json())

  return {
    props: {
      matches,
      eventInfo,
      eventTeams,
      eventAlliances,
      eventRankings,
      eventAwards,
    },
  };
};
