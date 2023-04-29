import { API_URL, CURR_YEAR } from "@/lib/constants";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsPeopleFill, BsFillCalendarEventFill } from "react-icons/bs";
import { FaMedal, FaSearch } from "react-icons/fa";
import { SiRobotframework } from "react-icons/si";
import { Loading } from "./Loading";
import { getStorage, setStorage } from "@/util/localStorage";
import { formatTime } from "@/util/time";
import { log } from "@/util/log";

const links = [
  { title: "Teams", href: "/teams", icon: <BsPeopleFill /> },
  { title: "Events", href: "/events", icon: <BsFillCalendarEventFill /> },
  { title: "Hall of Fame", href: "/fame", icon: <FaMedal /> },
  { title: "Rookie Teams", href: "/rookies", icon: <SiRobotframework /> },
];

async function fetchTeamsData() {
  const teamsData = getStorage(`teams_${CURR_YEAR}`);

  if (teamsData) {
    return teamsData;
  }

  const start = performance.now();
  const getTeams = async (pageNum: string) =>
    await fetch(`${API_URL}/api/team/teams?page=${pageNum}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json());
  const pageNumbers = [...Array(20).keys()].map((i) => i.toString());
  const pages = await Promise.all(pageNumbers.map((num) => getTeams(num)));
  const teams: any = pages.flatMap((page: any) => page);

  const newTeamData = teams.map((team: any) => {
    return {
      teamNumber: team.team_number,
      name: team.nickname,
    };
  });

  log(
    "warning",
    `Fetching [/team/teams] took ${formatTime(performance.now() - start)}`
  );

  setStorage(`teams_${CURR_YEAR}`, newTeamData);
  return newTeamData;
}

export const Navbar = () => {
  const [teams, setTeams] = useState<any>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showLinks, setShowLinks] = useState(false);
  const numLinksPerColumn = Math.ceil(links.length / 2);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchTeamsData();
      if (data) setTeams(data);
    }
    fetchData();
  }, []);

  const filteredOptions =
    teams &&
    teams.filter((team: any) =>
      (team.name + team.teamNumber)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0 && !isScrolled) {
        setIsScrolled(true);
      } else if (window.scrollY === 0 && isScrolled) {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  if (!teams) return <Loading />;

  return (
    <>
      <div
        className={`${
          isScrolled ? "fixed top-0 left-0 right-0 z-50" : ""
        } pl-8 pr-8`}
      >
        {" "}
        <div
          className={`${
            isScrolled ? "rounded-b-lg" : "mt-5 rounded-lg"
          } bg-gray-800 border-2 border-gray-500 py-5 px-10 mb-[-10px] h-full max-w-screen-3xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between`}
        >
          <div className="flex relative">
            <Link href="/" legacyBehavior>
              <a>
                <h1 className="font-black text-primary text-2xl">
                  sm<span className="text-white">.</span>
                </h1>
              </a>
            </Link>

            <div
              className={`absolute right-0 md:hidden block ${
                showLinks ? `bg-gray-600` : "bg-gray-700"
              } rounded-lg py-2 px-[13px] w-11`}
            >
              <AiOutlineMenu
                className="md:hidden text-white text-xl"
                onClick={() => setShowLinks(!showLinks)}
              />
            </div>
          </div>

          <div
            className={`md:flex md:items-center md:gap-6 ${
              showLinks ? "mt-5 grid grid-cols-2" : "hidden"
            }`}
          >
            {links.slice(0, numLinksPerColumn).map((link, key) => {
              return (
                <Link href={link.href} key={key} legacyBehavior>
                  <a className="block md:inline-block text-[0.9rem] text-gray-400 hover:text-primary mb-2 md:mb-0">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{link.icon}</span>
                      <span>{link.title}</span>
                    </div>
                  </a>
                </Link>
              );
            })}
            {links.slice(numLinksPerColumn).map((link, key) => {
              return (
                <Link href={link.href} key={key} legacyBehavior>
                  <a className="block md:inline-block text-[0.9rem] text-gray-400 hover:text-primary mb-2 md:mb-0">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{link.icon}</span>
                      <span>{link.title}</span>
                    </div>
                  </a>
                </Link>
              );
            })}

            <div className="relative">
              <input
                className="bg-gray-700 outline-none rounded-lg border text-gray-400 border-gray-500 px-3 py-1 text-sm pl-8"
                type="text"
                placeholder="Search teams, events..."
                onChange={(e) => setSearchTerm(e.target.value)}
                spellCheck={false}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-sm text-gray-400" />
              </span>

              <div
                className={`absolute top-10 z-50 w-full ${
                  teams && filteredOptions.length > 4 && "h-64 overflow-y-auto"
                } ${searchTerm && "border-2 border-gray-600"} rounded-lg`}
              >
                {teams &&
                  filteredOptions.map((team: any, key: number) => (
                    <Link
                      key={key}
                      href={`/teams/${team.teamNumber}`}
                      legacyBehavior
                    >
                      <a onClick={() => setSearchTerm("")}>
                        <div
                          className={`bg-gray-800 text-gray-400 py-1 px-3 border-2 border-b-gray-600 border-transparent cursor-pointer hover:bg-gray-700 ${
                            searchTerm.length === 0 && "hidden"
                          }`}
                          onClick={() =>
                            setSearchTerm(`${team.name} - ${team.teamNumber}`)
                          }
                        >
                          {team.teamNumber} | {team.name}
                        </div>
                      </a>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
