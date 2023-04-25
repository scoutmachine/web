import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import { Tooltip } from "@/components/Toolip";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home({ initial }: any) {
  const [allTeams, setAllTeams] = useState(
    initial.sort(() => Math.random() - 0.5)
  );
  const [query, setQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const getTeams = async () => {
      const baseFetch = async (pageNum: string) =>
        await fetch(`${API_URL}/api/team/teams?page=${pageNum}`).then((res) =>
          res.json()
        );
      const pageNumbers = [...Array(20).keys()].map((i) => i.toString());
      const pages = await Promise.all(pageNumbers.map((num) => baseFetch(num)));
      const teams = pages.flatMap((page: any) => page);

      return { initialTeams: teams };
    };

    const filterTeams = async () => {
      setIsSearching(true);
      const filteredTeams = (await getTeams()).initialTeams.filter(
        (team: any) =>
          (team.team_number + team.nickname + team.city)
            .toLowerCase()
            .includes(query.toLowerCase())
      );
      setIsSearching(false);
      return filteredTeams;
    };

    const runFilters = async () => {
      if (query) {
        setAllTeams(await filterTeams());
      } else {
        setAllTeams(initial.sort(() => Math.random() - 0.5));
      }
    };

    runFilters();
  }, [query, initial]);

  useEffect(() => {
    const loadMore = async () => {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const response = await fetch(
        `${API_URL}/api/team/teams?page=${nextPage}`
      );
      const newTeams = await response
        .json()
        .then((teams) => teams.slice(0, 100));
      setAllTeams([...allTeams, ...newTeams]);
      setPage(nextPage);
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
  }, [allTeams, isLoadingMore, page]);

  const changeSearch = (event: { target: { value: string } }) => {
    setQuery(event.target.value);
  };

  return (
    <>
      {isClient && (
        <>
          <Navbar />

          <div className="flex flex-col justify-center items-center">
            <Header />
            <input
              type="text"
              placeholder="Search teams..."
              value={query}
              onChange={changeSearch}
              spellCheck="false"
              className="rounded-lg bg-gray-700 border-2 border-gray-500 py-2 px-5 mt-5 md:pr-4 md:pl-4 pr-8 pl-8 md:w-[450px]"
            />
            <span className="text-xs text-gray-500 font-semibold lowercase mt-2">
              (Search by Team Number / Name / Location)
            </span>

            {query && allTeams.length !== 0 && (
              <div className="mt-5">
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

            <div
              className={`flex flex-col ${
                allTeams.length > 1 && "md:grid md:grid-cols-5"
              } gap-3 mt-10 pr-8 pl-8`}
            >
              {Array.isArray(allTeams) &&
                allTeams.map((team: any, key: number) => {
                  return (
                    <Tooltip team={team} key={key}>
                      <Link
                        href={`/teams/${team.team_number}`}
                        legacyBehavior
                        key={key}
                      >
                        <a>
                          <div className="px-5 py-10 bg-gray-700 border-2 border-gray-500 h-40 rounded-lg hover:bg-gray-600">
                            <h1 className="text-gray-200 font-black">
                              {team.nickname.length > 31
                                ? `${team.nickname.slice(0, 31)}...`
                                : team.nickname}
                            </h1>
                            <p className="text-gray-400 text-xs uppercase">
                              {team.city
                                ? `${team.city}, ${team.country}`
                                : "No location"}
                            </p>

                            <p className="text-gray-400 font-bold text-lg">
                              FRC {team.team_number}
                            </p>
                          </div>
                        </a>
                      </Link>
                    </Tooltip>
                  );
                })}
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

  return {
    props: {
      initial: await baseFetch(
        String(Math.floor(Math.random() * (18 - 0 + 1) + 0))
      ).then((teams) => teams.slice(0, 100)),
    },
  };
};
