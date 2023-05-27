/* eslint-disable @next/next/no-html-link-for-pages */
import Link from "next/link";
import Image from "next/image";
import React, { JSX, ReactNode, useEffect, useState } from "react";
import {
  FaBars,
  FaBolt,
  FaChartLine,
  FaCoffee,
  FaDiscord,
  FaGithub,
  FaHammer,
  FaMedal,
  FaRobot,
  FaSignOutAlt,
  FaTags,
  FaUndo,
  FaUserCircle,
  FaEdit,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Dropdown } from "../Dropdown";
import { SignupModal } from "../modals/SignupModal";
import { EditProfileModal } from "../modals/EditProfileModal";
import { SignoutModal } from "../modals/SignoutModal";
import { getFavourites } from "@/utils/favourites";
import { Search } from "./Search";
import { Team } from "@/types/Team";
import {
  API_URL,
  BMAC_URL,
  CURR_YEAR,
  DISCORD_URL,
  GITHUB_URL,
} from "@/lib/constants";
import router from "next/router";
import { getStorage, setStorage } from "@/utils/localStorage";
import { Loading } from "../Loading";

const Social = (props: { icon: ReactNode }) => {
  return (
    <span className="flex cursor-pointer flex-col items-center rounded-md p-1 bg-gray-200 hover:bg-gray-300 text-black dark:text-white dark:bg-[#1f1f1f] dark:hover:bg-[#2a2a2a] text-xl mt-1">
      {props.icon}
    </span>
  );
};

const links: { title: string; href: string; icon: JSX.Element }[] = [
  { title: "Teams", href: "/teams", icon: <FaRobot /> },
  { title: "Events", href: "/events", icon: <FaHammer /> },
  { title: "Hall of Fame", href: "/fame", icon: <FaMedal /> },
  { title: "Rookie Teams", href: "/rookies", icon: <FaBolt /> },
  { title: "Insights", href: "/insights", icon: <FaChartLine /> },
  { title: "Marketplace", href: "/marketplace", icon: <FaTags /> },
];

export const Navbar = (props: {
  active?: string;
  refresh?: boolean;
}): JSX.Element => {
  const [teams, setTeams] = useState<any>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showLinks, setShowLinks] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const { data: session, status } = useSession();

  const [favourites, setFavourites] = useState<any>();

  useEffect((): void => {
    getFavourites(setFavourites);
  }, []);

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      const teamsData = getStorage(`teams`);
      if (teamsData) return setTeams(teamsData);

      const data = await fetch(`${API_URL}/api/v2/teams/all`).then(
        (res: Response) => res.json()
      );

      setTeams(data);
      setStorage(`teams`, data, 60 * 60 * 24 * 7 * 4); // 4 weeks (28 days)
    }

    fetchData();
  }, [teams]);

  const filteredOptions =
    teams &&
    teams.filter((team: Team) =>
      (team.nickname + team.team_number)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return (): void => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  useEffect((): void => {
    window.addEventListener("click", () => setSearchTerm(""));
  });

  if (status === "loading") return <Loading />;

  return (
    <>
      <div
        className={`sticky top-0 pl-4 pr-4 md:pr-8 md:pl-8 ${
          isScrolled && "z-50"
        }`}
      >
        <div
          className={`${
            isScrolled ? "rounded-b-lg" : "mt-5 rounded-lg"
          } bg-[#f7f7f7] border border-gray-300 dark:bg-card dark:border-[#2A2A2A] py-5 px-10 mb-[-10px] h-full max-w-screen-3xl mx-auto flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between`}
        >
          <div className="flex relative space-x-1">
            <a href="/">
              <h1 className="font-extrabold text-black dark:text-white text-2xl mr-2 hidden md:block">
                sm
              </h1>
              <h1 className="font-black text-black dark:text-white text-2xl mr-2 md:hidden">
                sm
              </h1>
            </a>

            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Social icon={<FaGithub />} />
            </a>

            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              <Social icon={<FaDiscord />} />
            </a>

            <a href={BMAC_URL} target="_blank" rel="noopener noreferrer">
              <Social icon={<FaCoffee />} />
            </a>

            <button
              className={`absolute right-0 2xl:hidden block border border-[#2A2A2A] ${
                showLinks ? `bg-[#1F1F1F]` : "bg-card"
              } rounded-lg py-2 px-[13px]`}
              onClick={() => setShowLinks(!showLinks)}
            >
              <FaBars className="2xl:hidden text-black dark:text-white text-xl" />
            </button>
          </div>

          <div
            className={`2xl:flex 2xl:items-center 2xl:gap-6 ${
              showLinks ? "mt-5 2xl:mt-0 grid grid-cols-2" : "hidden"
            }`}
          >
            {links.map(
              (
                link: { title: string; href: string; icon: JSX.Element },
                key: number
              ) => {
                return (
                  <a href={link.href} key={key}>
                    <p
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
                    </p>
                  </a>
                );
              }
            )}

            <Search
              teams={teams}
              filteredOptions={filteredOptions}
              favourites={favourites}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              session={session}
              refresh={props.refresh}
            />

            {session ? (
              <Dropdown
                state={profileDropdown}
                item={
                  <Image
                    src={session.user?.image as string}
                    className="rounded-full cursor-pointer ml-4 mt-3 md:mt-0"
                    width={30}
                    height={30}
                    alt={`${session.user?.name} Avatar`}
                    priority={true}
                    onClick={() => setProfileDropdown(!profileDropdown)}
                  />
                }
              >
                <div className="py-2 gap-y-2 flex flex-col items-center">
                  <p
                    className="text-sm text-lightGray cursor-pointer whitespace-nowrap hover:text-primary"
                    onClick={(): void => {
                      router.push(`/users/${session.user.username}`);
                    }}
                  >
                    <FaUserCircle className="text-lg mr-1 inline-block" /> View
                    Profile
                  </p>

                  <p
                    className="text-sm text-lightGray cursor-pointer whitespace-nowrap hover:text-primary"
                    onClick={(): void => {
                      setShowEditProfileModal(true);
                      setProfileDropdown(false);
                    }}
                  >
                    <FaEdit className="text-lg mr-1 inline-block" /> Edit
                    Profile
                  </p>

                  <p
                    className="text-sm text-lightGray hover:text-primary cursor-pointer whitespace-nowrap hover:text-primary"
                    onClick={(): void => {
                      localStorage.clear();
                      router.reload();
                    }}
                  >
                    <FaUndo className="text-lg mr-1 inline-block" /> Clear Cache
                  </p>

                  <p
                    className="text-sm text-lightGray hover:text-red-400 cursor-pointer whitespace-nowrap hover:text-primary"
                    onClick={(): void => {
                      setShowSignoutModal(true);
                      setProfileDropdown(false);
                    }}
                  >
                    <FaSignOutAlt className="text-lg mr-1 inline-block" /> Sign
                    Out
                  </p>
                </div>
              </Dropdown>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="md:mt-0 mt-3 text-sm border border-[#2A2A2A] bg-card hover:border-gray-600 px-3 py-[6px] text-lightGray font-medium rounded-lg md:ml-[-10px] ml-4"
              >
                <FaUserCircle className="text-lg mr-1 inline-block" /> Sign in
              </button>
            )}
          </div>
        </div>
      </div>

      <SignupModal isOpen={showLoginModal} setOpen={setShowLoginModal} />

      <SignoutModal isOpen={showSignoutModal} setOpen={setShowSignoutModal} />

      <EditProfileModal
        isOpen={showEditProfileModal}
        setOpen={setShowEditProfileModal}
      />
    </>
  );
};
