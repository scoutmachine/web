import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home({ initialTeams, initial }: any) {
  const [allTeams, setAllTeams] = useState(
    initial.sort(() => Math.random() - 0.5)
  );
  const [query, setQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setIsClient(true);

    const filterTeams = () => {
      return initialTeams.filter((team: any) =>
        (team.team_number + team.nickname + team.city)
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    };

    if (query) {
      setAllTeams(filterTeams());
    } else {
      setAllTeams(initial.sort(() => Math.random() - 0.5));
    }
  }, [query, initialTeams, initial]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const response = await fetch(`${API_URL}/api/team/teams?page=${nextPage}`);
    const newTeams = await response.json();
    setAllTeams([...allTeams, ...newTeams]);
    setPage(nextPage);
  };

  const changeSearch = (event: { target: { value: string } }) => {
    setQuery(event.target.value);
  };

  return (
    <>
      {isClient && (
        <>
          <div className="flex flex-col justify-center items-center">
            <Header />
            <input
              type="text"
              placeholder="Search teams..."
              value={query}
              onChange={changeSearch}
              spellCheck="false"
              className="rounded-lg bg-gray-700 py-2 px-5 mt-5 md:pr-4 md:pl-4 pr-8 pl-8 md:w-[450px]"
            />

            {allTeams.length === 0 && (
              <div className="mt-5">
                <span>
                  😥 No results found for <strong>{query}</strong>.
                </span>
              </div>
            )}

            <div className="flex flex-col md:grid md:grid-cols-6 gap-3 mt-10 md:pr-32 md:pl-32 pr-8 pl-8">
              {allTeams.map((team: any, key: number) => {
                return (
                  <Link href={`/${team.team_number}`} legacyBehavior key={key}>
                    <a>
                      <div className="px-5 py-10 bg-gray-700 border-2 border-gray-500 h-40 rounded-lg hover:bg-gray-600">
                        <h1 className="text-gray-200 font-black">
                          {team.nickname}
                        </h1>
                        <p className="text-gray-400 text-xs uppercase">
                          {team.city ? `${team.city}, ${team.country}` : "No location"}
                        </p>

                        <p className="text-gray-400 font-bold text-lg">
                          FRC {team.team_number}
                        </p>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={loadMore}
              className="rounded-lg bg-gray-700 py-2 px-5 mt-5 text-gray-200 hover:bg-gray-600"
            >
              Load more
            </button>
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

  const page0 = await baseFetch("0");
  const page1 = await baseFetch("1");
  const page2 = await baseFetch("2");
  const page3 = await baseFetch("3");
  const page4 = await baseFetch("4");
  const page5 = await baseFetch("5");
  const page6 = await baseFetch("6");
  const page7 = await baseFetch("7");
  const page8 = await baseFetch("8");
  const page9 = await baseFetch("9");
  const page10 = await baseFetch("10");
  const page11 = await baseFetch("11");
  const page12 = await baseFetch("12");
  const page13 = await baseFetch("13");
  const page14 = await baseFetch("14");
  const page15 = await baseFetch("15");
  const page16 = await baseFetch("16");
  const page17 = await baseFetch("17");
  const page18 = await baseFetch("18");
  const page19 = await baseFetch("19");

  return {
    props: {
      initial: await baseFetch(
        String(Math.floor(Math.random() * (18 - 0 + 1) + 0))
      ),
      initialTeams: [
        ...page0,
        ...page1,
        ...page2,
        ...page3,
        ...page4,
        ...page5,
        ...page6,
        ...page7,
        ...page8,
        ...page9,
        ...page10,
        ...page11,
        ...page12,
        ...page13,
        ...page14,
        ...page15,
        ...page16,
        ...page17,
        ...page18,
        ...page19,
      ],
    },
  };
};
