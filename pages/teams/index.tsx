import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TeamCard } from "@/components/TeamCard";
import { AiFillHome } from "react-icons/ai";

export default function TeamsPage({ initial, avatars }: any) {
  const [allTeams, setAllTeams] = useState(initial);
  const [query, setQuery] = useState("");
  const [filterByNumber, setFilterByNumber] = useState<number>(0);
  const [value] = useDebounce(query, 500);
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const FilterNumber = (props: any) => {
    return (
      <button
        onClick={() => setFilterByNumber(props.name.slice(0, -1))}
        className={`${
          filterByNumber === props.name.slice(0, -1)
            ? "bg-gray-600"
            : "bg-gray-700 hover:bg-gray-600"
        } px-3 py-1 text-gray-300 text-sm rounded-lg border-2 border-gray-500`}
      >
        {props.name}
      </button>
    );
  };

  useEffect(() => {
    setIsClient(true);

    const filterTeams = async () => {
      setIsSearching(true);

      const filteredTeams = await fetch(
        `${API_URL}/api/team/query?q=${value}`
      ).then((res) => res.json());

      setIsSearching(false);
      return filteredTeams.teams;
    };

    const filterTeamsByNumber = async () => {
      setIsSearching(true);

      const filteredTeams = await fetch(
        `${API_URL}/api/team/query?f=${filterByNumber}`
      ).then((res) => res.json());

      setIsSearching(false);
      return filteredTeams.teams;
    };

    const runFilters = async () => {
      if (value) {
        setAllTeams(await filterTeams());
      } else if (filterByNumber !== 0) {
        setAllTeams(await filterTeamsByNumber());
      } else {
        setAllTeams(initial.sort(() => Math.random() - 0.5));
      }
    };

    runFilters();
  }, [filterByNumber, initial, query, value]);

  useEffect(() => {
    const loadMore = async () => {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetch(
        `${API_URL}/api/team/teams?page=${nextPage}`
      );
      const newTeams = await response
        .json()
        .then((teams) => teams.slice(0, 50));
      setAllTeams([...allTeams, ...newTeams]);
      setPage(nextPage);

      const getTeamAvatars = newTeams.map(async (team: any) => {
        const data = await fetch(
          `${API_URL}/api/team/avatar?team=${team.team_number}`
        ).then((res) => res.json());

        try {
          avatars[team.team_number] = data.avatar;
        } catch (e) {
          console.error(e);
        }
      });

      await Promise.all(getTeamAvatars);
      setIsLoadingMore(false);
    };

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !isLoadingMore
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allTeams, isLoadingMore, page, avatars]);

  const changeSearch = (event: { target: { value: string } }) => {
    setQuery(event.target.value);
  };

  return (
    <>
      {isClient && (
        <>
          <Navbar />

          <div className="flex flex-col">
            <Header
              title="Teams"
              desc=" The all-in-one tool your FRC team needs to find the data you
                  want, whenever you want."
            >
              <input
                type="text"
                placeholder="Search teams..."
                value={query}
                onChange={changeSearch}
                spellCheck="false"
                className="rounded-lg bg-gray-700 border-2 border-gray-500 py-2 px-5 mt-5 md:pr-4 md:pl-4 pr-8 pl-8 md:w-[450px]"
              />
              <span className="flex text-xs text-gray-500 font-semibold lowercase mt-2">
                (Search by Team Number / Name / Location)
              </span>

              <div className="mt-5 mb-[-15px] gap-2 flex">
                <button
                  onClick={() => {
                    setFilterByNumber(0);
                    setAllTeams(initial);
                  }}
                  className={`${
                    filterByNumber === 0
                      ? "bg-gray-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  } px-3 py-1 text-gray-300 text-sm rounded-lg border-2 border-gray-500`}
                >
                  <AiFillHome />
                </button>
                <FilterNumber name="999s" />
                <FilterNumber name="1000s" />
                <FilterNumber name="2000s" />
                <FilterNumber name="3000s" />
                <FilterNumber name="4000s" />
                <FilterNumber name="5000s" />
                <FilterNumber name="6000s" />
                <FilterNumber name="7000s" />
                <FilterNumber name="8000s" />
                <FilterNumber name="9000s" />
              </div>
            </Header>

            {query && allTeams.length !== 0 && (
              <div className="mt-5 pl-8">
                <span className="text-gray-400 text-sm">
                  {isSearching ? "Filtering" : "Filtered"} through{" "}
                  {allTeams.length} FRC team{allTeams.length > 1 ? "s" : ""} by
                  &quot;{query}
                  &quot;
                </span>
              </div>
            )}

            {allTeams.length === 0 && (
              <div className="text-gray-400 text-sm mt-5">
                <span>
                  😥 No results found for <strong>{query}</strong>.
                </span>
              </div>
            )}

            <h1 className="text-gray-400 pl-8 mt-5 mb-3 text-xl">
              showing <span className="font-bold">{allTeams.length}</span> teams
              (out of 9999)
            </h1>

            <div className="w-full mx-auto pr-8 pl-8">
              <div className="flex flex-col w-full sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Array.isArray(allTeams) &&
                  allTeams.map((team: any, key: number) => {
                    return <TeamCard key={key} team={team} avatars={avatars} />;
                  })}
              </div>
            </div>

            {!query && isLoadingMore && (
              <span className="text-gray-400 mt-5">
                Hang tight! Loading more teams...
              </span>
            )}
          </div>

          <Footer />
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=604800, stale-while-revalidate=604800"
  );

  const { teams, avatars } = await fetch(`${API_URL}/api/getTeams`).then(
    (res) => res.json()
  );

  return {
    props: {
      initial: teams,
      avatars,
    },
  };
};
