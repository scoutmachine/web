import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TeamCard } from "@/components/TeamCard";

export default function Home({ initial, teamAvatars }: any) {
  const [allTeams, setAllTeams] = useState(initial);
  const [query, setQuery] = useState("");
  const [value] = useDebounce(query, 500);
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

    const runFilters = async () => {
      if (value) {
        setAllTeams(await filterTeams());
      } else {
        setAllTeams(initial.sort(() => Math.random() - 0.5));
      }
    };

    runFilters();
  }, [initial, query, value]);

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
          teamAvatars[team.team_number] = data.avatar;
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
  }, [allTeams, isLoadingMore, page, teamAvatars]);

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

            <div className="w-full mx-auto pr-8 pl-8">
              <div className="flex flex-col w-full sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-10">
                {Array.isArray(allTeams) &&
                  allTeams.map((team: any, key: number) => {
                    return (
                      <TeamCard key={key} team={team} avatars={teamAvatars} />
                    );
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=604800"
  );

  const baseFetch = async (pageNum: string) =>
    await fetch(`${API_URL}/api/team/teams?page=${pageNum}`).then((res) =>
      res.json()
    );

  const getTeams = await baseFetch(
    String(Math.floor(Math.random() * (18 - 0 + 1) + 0))
  ).then((teams) => teams.slice(0, 50));

  const teamAvatars: any = {};

  const getTeamAvatars = getTeams.map(async (team: any) => {
    const data = await fetch(
      `${API_URL}/api/team/avatar?team=${team.team_number}`
    ).then((res) => res.json());

    try {
      teamAvatars[team.team_number] = data.avatar;
    } catch (e) {
      console.error(e);
    }
  });

  await Promise.all(getTeamAvatars);

  return {
    props: {
      initial: getTeams,
      teamAvatars,
    },
  };
};
