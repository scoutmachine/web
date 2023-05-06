import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TeamCard } from "@/components/TeamCard";
import { FaSearch } from "react-icons/fa";
import Head from "next/head";
import { getStorage, setStorage } from "@/util/localStorage";
import { Loading } from "@/components/Loading";
import { formatTime } from "@/util/time";
import { log } from "@/util/log";

async function fetchTeamsData(
  startIndex: number,
  endIndex: number,
  searchTerm: string = ""
) {
  const teamsData = getStorage(`teams_${CURR_YEAR}`);
  const teamAvatarsData = getStorage(`cached_avatars_${CURR_YEAR}`);
  const sortedTeams = teamsData.sort(() => Math.random() - 0.5);

  if (teamsData && teamAvatarsData) {
    const filteredTeams = teamsData.filter((team: any) =>
      (team.team_number + team.nickname + team.city)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return {
      teams: searchTerm
        ? filteredTeams.slice(startIndex, endIndex)
        : sortedTeams.slice(0, 50),
      avatars: teamAvatarsData,
    };
  }

  const teamAvatars: any = {};
  const teamsSlice = sortedTeams.slice(startIndex, endIndex);
  const start = performance.now();

  await Promise.all(
    teamsSlice.map(async (team: any) => {
      const avatar = await fetch(
        `${API_URL}/api/team/avatar?team=${team.team_number}`
      ).then((res) => res.json());

      try {
        teamAvatars[team.team_number] = avatar.avatar;
      } catch {
        teamAvatars[team.team_number] = null;
      }
    })
  );

  log("warning", `Fetched avatars in ${formatTime(performance.now() - start)}`);

  setStorage(`cached_avatars_${CURR_YEAR}`, teamAvatars);

  return {
    teams: teamsSlice,
    avatars: teamAvatars,
  };
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<any>([]);
  const [query, setQuery] = useState("");
  const [avatars, setAvatars] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(50);
  const itemsPerPage = 50;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.pageYOffset;
      const contentHeight = document.documentElement.scrollHeight;

      if (scrollPosition > contentHeight * 0.8 && !isLoading) {
        setIsLoading(true);
        setStartIndex(endIndex + 1);
        setEndIndex(endIndex + itemsPerPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, startIndex, endIndex]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { teams, avatars } = await fetchTeamsData(startIndex, endIndex);
      setTeams((prevTeams: any) => [...prevTeams, ...teams]);
      setAvatars(avatars);
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchTeams();
  }, [startIndex, endIndex]);

  const changeSearch = async (event: { target: { value: string } }) => {
    const searchTerm = event.target.value;
    setQuery(searchTerm);
    setIsLoading(true);
    setStartIndex(0);
    setEndIndex(itemsPerPage);

    const { teams, avatars } = await fetchTeamsData(
      0,
      itemsPerPage,
      searchTerm
    );
    setTeams(teams);
    setAvatars(avatars);
    setIsLoading(false);
  };

  if (!teams && !avatars) return <Loading />;

  return (
    <>
      <>
        <Head>
          <title>Teams | Scout Machine</title>
        </Head>
        <Navbar active="Teams" />

        <div className="flex flex-col">
          <Header
            title="Teams"
            desc="Unleash the excitement of FRC with a new way to discover teams"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search teams (team #, location, name)..."
                value={query}
                onChange={changeSearch}
                spellCheck="false"
                className="border border-[#2A2A2A] bg-card outline-none rounded-lg text-lightGray px-3 py-[6px] px-5 text-sm pl-8 md:w-[450px] mt-5"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-5">
                <FaSearch className="text-sm text-lightGray" />
              </span>
            </div>
          </Header>

          <div className="w-full mx-auto pl-4 pr-4 md:pr-8 md:pl-8">
            <div className="flex flex-col w-full sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {teams.map((team: any, key: number) => {
                return <TeamCard key={key} team={team} avatars={avatars} />;
              })}
            </div>
          </div>
        </div>

        <Footer />
      </>
    </>
  );
}
