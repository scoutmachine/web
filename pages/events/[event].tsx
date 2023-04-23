import { EventData } from "@/components/EventData";
import { Footer } from "@/components/Footer";
import { TabButton } from "@/components/TabButton";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ImCross } from "react-icons/im";

export default function Event({
  matches,
  eventInfo,
  eventTeams,
  eventAlliances,
  eventRankings,
  eventAwards,
}: any) {
  const router = useRouter();
  const { team } = router.query;
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-16 pr-8 pl-8">
        <div className="bg-gray-800 md:w-[900px] rounded-lg py-12 px-12">
          <h1 className="text-3xl text-primary tetxt-left font-black">
            {eventInfo.name}
          </h1>
          <p className="text-gray-400 text-left">
            {eventInfo.city}, {eventInfo.country} •{" "}
            {eventInfo.district && (
              <span>{eventInfo.district.display_name} District • </span>
            )}
            <a
              href={`https://frc-events.firstinspires.org/${eventInfo.year}/${eventInfo.event_code}`}
              target="_blank"
            >
              <span className="text-white hover:text-primary">
                FIRST Inspires
              </span>
            </a>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center mt-5 pr-8 pl-8">
        <div className="bg-gray-800 md:w-[900px] rounded-lg py-6 px-12">
          <h1 className="text-2xl text-primary font-black">
            Alliances{" "}
            <span className="text-gray-400 font-medium">
              ─ Who got selected?
            </span>
          </h1>
          <table className="w-full mt-5 text-sm text-left bg-gray-600 border-2 border-gray-500">
            <thead className="text-xs text-white uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">
                  #
                </th>
                <th scope="col" className="px-6 py-3">
                  Captain
                </th>
                <th scope="col" className="px-6 py-3">
                  1st Pick
                </th>
                <th scope="col" className="px-6 py-3">
                  2nd Pick
                </th>
                <th scope="col" className="px-6 py-3">
                  Backup
                </th>
              </tr>
            </thead>
            <tbody>
              {eventAlliances.map((alliance: any, key: number) => {
                return (
                  <tr
                    key={key}
                    className="text-gray-300 bg-gray-700 border-2 border-gray-500 hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-bold">{alliance.name}</td>

                    <td className="px-6 py-4 hover:text-primary">
                      <Link
                        href={`/${alliance.picks[0].slice(3)}`}
                        legacyBehavior
                      >
                        <a>{alliance.picks[0].slice(3)}</a>
                      </Link>
                    </td>

                    <td className="px-6 py-4 hover:text-primary">
                      <Link
                        href={`/${alliance.picks[1].slice(3)}`}
                        legacyBehavior
                      >
                        <a>{alliance.picks[1].slice(3)}</a>
                      </Link>
                    </td>

                    <td className="px-6 py-4 hover:text-primary">
                      <Link
                        href={`/${alliance.picks[2].slice(3)}`}
                        legacyBehavior
                      >
                        <a>{alliance.picks[2].slice(3)}</a>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {alliance.picks.length > 3 ? (
                        <Link
                          href={`/${alliance.picks[3].slice(3)}`}
                          legacyBehavior
                        >
                          <a className="hover:text-primary">
                            {alliance.picks[3].slice(3)}
                          </a>
                        </Link>
                      ) : (
                        <ImCross className="text-gray-500" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-800 px-10 py-10 mt-5 rounded-lg md:w-[900px] w-[350px]">
          <div className="flex gap-5">
            <TabButton
              active={activeTab}
              tab={1}
              onClick={() => handleTabClick(1)}
            >
              Results
            </TabButton>
            <TabButton
              active={activeTab}
              tab={2}
              onClick={() => handleTabClick(2)}
            >
              Rankings
            </TabButton>
            <TabButton
              active={activeTab}
              tab={3}
              onClick={() => handleTabClick(3)}
            >
              Awards
            </TabButton>
            <TabButton
              active={activeTab}
              tab={4}
              onClick={() => handleTabClick(4)}
            >
              Teams ({eventTeams.length})
            </TabButton>
          </div>

          {activeTab === 4 && (
            <div className="flex flex-col md:grid grid-cols-3 gap-5 mt-5">
              {eventTeams.map((team: any, key: number) => {
                return (
                  <Link key={key} href={`/${team.team_number}`} legacyBehavior>
                    <a>
                      <div className="bg-gray-700 border-2 border-gray-500 hover:bg-gray-600 rounded-lg py-3 px-5">
                        <h1 className="font-black text-xl">
                          {team.nickname.length > 17
                            ? `${team.nickname.slice(0, 17)}...`
                            : team.nickname}
                        </h1>
                        <p className="text-gray-400">{team.team_number}</p>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          )}

          {activeTab === 1 &&
            (matches.length > 0 ? (
              <EventData
                data={matches}
                isTeam={team ? true : false}
                team={team}
              />
            ) : (
              <p className="text-red-400 font-bold py-3 px-5 rounded-lg border-2 border-red-500">
                Looks like there&apos;s no data available for this event! 😔{" "}
              </p>
            ))}
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
  ).then((res) => res.json());

  const eventRankings = await fetch(
    `${API_URL}/api/events/rankings?event=${event}`
  ).then((res) => res.json());

  const eventAwards = await fetch(
    `${API_URL}/api/events/awards?event=${event}`
  ).then((res) => res.json());

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
