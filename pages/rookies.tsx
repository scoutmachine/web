import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { SiRobotframework } from "react-icons/si";

export default function HOF({ rookieTeams }: any) {
  return (
    <>
      <Navbar />

      <div className="flex flex-wrap items-center justify-center mt-16 pr-8 pl-8">
        <div className="bg-gray-800 md:w-[1550px] w-[350px] rounded-lg py-12 px-12">
          <h1 className="md:flex text-3xl md:text-5xl font-black text-primary mb-2">
            <SiRobotframework className="mr-3 md:ml-0 ml-[-10px] md:mb-0 mb-3 w-[50px]" />{" "}
            <span className="italic md:mr-3 mr-1">FIRST</span> Rookie Teams
          </h1>

          <p className="text-gray-400">
            Get ready to meet the fresh new faces of{" "}
            <span className="italic">FIRST</span> Robotics for 2023! With over{" "}
            <span className="font-bold text-white">{rookieTeams.length}</span>{" "}
            rookie teams joining the competition this year, the excitement is at an
            all-time high. We&apos;re thrilled to highlight these up-and-coming
            teams and give them the recognition they deserve. <br /> <br />
            From the entire <span className="italic">FIRST</span> community,
            welcome!
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg py-10 md:px-10 px-[26px] flex items-center justify-center grid md:grid-cols-5 grid-cols-2 mt-5 gap-4 md:w-[1550px] w-[350px]">
          {rookieTeams.map((team: any, key: number) => {
            return (
              <Link
                key={key}
                href={`/teams/${team.team_number}`}
                legacyBehavior
              >
                <a>
                  <div className="bg-gray-700 hover:bg-gray-600 py-5 px-5 rounded-lg h-24 border-2 border-gray-500">
                    <h1 className="font-semibold text-gray-300 text-xl">
                      Team {team.team_number}
                    </h1>
                    <p className="text-gray-400 text-sm">
                      {team.city}, {team.country}
                    </p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
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
  const pageNumbers = [...Array(20).keys()].map((i) => i.toString());
  const pages = await Promise.all(pageNumbers.map((num) => baseFetch(num)));
  const rookieTeams = pages
    .flatMap((page: any) => page)
    .filter((team: any) => team.rookie_year === 2023 && !team.nickname.includes("Off-Season"));

  return {
    props: {
      rookieTeams,
    },
  };
};
