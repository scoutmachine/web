import { API_URL, CURR_YEAR } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaMedal,
  FaSearch,
  FaRobot,
  FaHammer,
  FaGithub,
  FaDiscord,
  FaCoffee,
  FaSignOutAlt,
  FaUserCircle,
  FaTag,
  FaBolt,
  FaTwitch,
  FaBars
} from "react-icons/fa";
import { Loading } from "./Loading";
import { getStorage, setStorage } from "@/util/localStorage";
import { formatTime } from "@/util/time";
import { log } from "@/util/log";
import { signOut, useSession } from "next-auth/react";
import { Dropdown } from "./Dropdown";
import { SignupModal } from "./modals/SignupModal";
import { EditProfileModal } from "./modals/EditProfileModal";

const Social = (props: any) => {
  return (
    <span className="flex cursor-pointer flex-col items-center rounded-md bg-gray-500 p-1 text-white hover:bg-gray-200 dark:bg-[#1f1f1f] hover:dark:bg-[#2a2a2a] text-xl mt-1">
      {props.icon}
    </span>
  );
};

const links = [
  { title: "Teams", href: "/teams", icon: <FaRobot /> },
  { title: "Events", href: "/events", icon: <FaHammer /> },
  { title: "Hall of Fame", href: "/fame", icon: <FaMedal /> },
  { title: "Rookie Teams", href: "/rookies", icon: <FaBolt /> },
  { title: "Game Day", href: "/gameday", icon: <FaTwitch /> },
  { title: "Marketplace", href: "/marketplace", icon: <FaTag /> },
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

export const Navbar = (props: { active?: string; dontScroll?: boolean }) => {
  const [teams, setTeams] = useState<any>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showLinks, setShowLinks] = useState(false);
  const numLinksPerColumn = Math.ceil(links.length / 2);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const { data: session, status } = useSession();

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
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  useEffect(() => {
    window.addEventListener("click", () => setSearchTerm(""));
  });

  if (!teams) return <Loading />;
  if (status === "loading") return <Loading />;

  return (
    <>
      <div className={`sticky top-0 pl-8 pr-8 ${isScrolled && "z-50"}`}>
        <div
          className={`${
            isScrolled ? "rounded-b-lg" : "mt-5 rounded-lg"
          } bg-card border dark:border-[#2A2A2A] dark:bg-[#191919] py-5 px-10 mb-[-10px] h-full max-w-screen-3xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between`}
        >
          <div className="flex relative space-x-1">
            <Link href="/" legacyBehavior>
              <a>
                <h1 className="font-extrabold text-white text-2xl mr-2 hidden md:block">
                  sm
                </h1>
                <h1 className="font-black text-white text-2xl mr-2 md:hidden">
                  sm
                </h1>
              </a>
            </Link>

            <a href="https://github.com/gryphonmachine/machine" target="_blank">
              <Social icon={<FaGithub />} />
            </a>

            <a href="https://discord.gg/yYtc8gpsXK" target="_blank">
              <Social icon={<FaDiscord />} />
            </a>

            <a href="https://www.buymeacoffee.com/scoutmachine" target="_blank">
              <Social icon={<FaCoffee />} />
            </a>

            <div
              className={`absolute right-0 md:hidden block border dark:border-[#2A2A2A] ${
                showLinks ? `bg-[#1F1F1F]` : "dark:bg-card"
              } rounded-lg py-2 px-[13px]`}
            >
              <FaBars
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
                  <a
                    className={`block md:inline-block text-[0.9rem] ${
                      props.active === link.title
                        ? "text-primary"
                        : "text-lightGray"
                    } font-medium mb-2 md:mb-0`}
                  >
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
                  <a
                    className={`block md:inline-block text-[0.9rem] ${
                      props.active === link.title
                        ? "text-primary"
                        : "text-lightGray"
                    } font-medium mb-2 md:mb-0`}
                  >
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
                className="border dark:border-[#2A2A2A] dark:bg-card outline-none rounded-lg text-lightGray px-3 py-[6px] text-sm pl-8"
                type="text"
                placeholder="Search teams..."
                onChange={(e) => setSearchTerm(e.target.value)}
                spellCheck={false}
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-sm text-lightGray" />
              </span>

              <div
                className={`absolute top-10 w-full overflow-x-hidden ${
                  teams && filteredOptions.length > 4 && "h-64 overflow-y-auto"
                } ${
                  searchTerm && "z-50 border dark:border-[#2A2A2A]"
                } rounded-lg`}
              >
                {teams && filteredOptions.length > 0 ? (
                  filteredOptions.map((team: any, key: number) => (
                    <Link
                      key={key}
                      href={`/teams/${team.teamNumber}`}
                      legacyBehavior
                    >
                      <a onClick={() => setSearchTerm("")}>
                        <div
                          className={`bg-card text-lightGray hover:dark:bg-[#191919] py-1 px-3 cursor-pointer hover:bg-gray-700 ${
                            searchTerm.length === 0 && "hidden"
                          }`}
                          onClick={() =>
                            setSearchTerm(`${team.name} - ${team.teamNumber}`)
                          }
                        >
                          <span className="font-medium">
                            Team {team.teamNumber} |
                          </span>{" "}
                          {team.name}
                        </div>
                      </a>
                    </Link>
                  ))
                ) : (
                  <div className="bg-card">
                    <p className="text-lightGray px-2 py-2 text-sm">
                      No results found.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {session ? (
              <Dropdown
                state={profileDropdown}
                item={
                  <Image
                    src={session?.user?.image!}
                    className="h-8 w-8 rounded-full cursor-pointer"
                    width={50}
                    height={50}
                    alt="pfp"
                    onClick={() => setProfileDropdown(!profileDropdown)}
                  />
                }
              >
                <div className="py-2 gap-y-2 flex flex-col items-center">
                  <p
                    className="flex text-sm text-lightGray cursor-pointer whitespace-nowrap hover:text-primary"
                    onClick={() => {
                      setShowEditProfileModal(true);
                      setProfileDropdown(false);
                    }}
                  >
                    <FaUserCircle className="text-lg mr-2" /> Edit Profile
                  </p>

                  <p
                    className="flex text-sm text-lightGray hover:text-red-400 cursor-pointer whitespace-nowrap hover:text-primary"
                    onClick={() => signOut()}
                  >
                    <FaSignOutAlt className="text-lg mr-2" /> Sign Out
                  </p>
                </div>
              </Dropdown>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-sm flex border dark:border-[#2A2A2A] dark:bg-card hover:border-gray-600 py-1 px-4 text-lightGray font-medium rounded-lg ml-[-10px]"
              >
                <FaUserCircle className="text-lg" />
              </button>
            )}
          </div>
        </div>
      </div>

      <SignupModal isOpen={showLoginModal} setOpen={setShowLoginModal} />

      <EditProfileModal
        isOpen={showEditProfileModal}
        setOpen={setShowEditProfileModal}
      />
    </>
  );
};
