import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import { TeamCard } from "@/components/TeamCard";
import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import { SiRobotframework } from "react-icons/si";

export default function RookiesPage({ rookieTeams, teamAvatars }: any) {
  return (
    <>
      <Navbar />

      <Header
        className="flex"
        title={
          <p className="md:flex text-3xl md:text-5xl font-black text-primary mb-2">
            <SiRobotframework className="mr-3 md:ml-0 ml-[-10px] md:mb-0 mb-3 w-[50px]" />
            <span className="italic md:mr-3 mr-1">FIRST</span> Rookie Teams
          </p>
        }
        desc={
          <p>
            Get ready to meet the fresh new faces of{" "}
            <span className="italic">FIRST</span> Robotics for 2023! With over{" "}
            <span className="font-bold text-white">{rookieTeams.length}</span>{" "}
            rookie teams joining the competition this year, the excitement is at
            an all-time high. We&apos;re thrilled to highlight these
            up-and-coming teams and give them the recognition they deserve.{" "}
            <br /> <br />
            From the entire <span className="italic">FIRST</span> community,
            welcome!
          </p>
        }
      />

      <div className="w-full mx-auto pr-8 pl-8">
        <div className="flex flex-col w-full sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-10">
          {Array.isArray(rookieTeams) &&
            rookieTeams.map((team: any, key: number) => {
              return <TeamCard key={key} team={team} avatars={teamAvatars} />;
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
    .filter(
      (team: any) =>
        team.rookie_year === 2023 && !team.nickname.includes("Off-Season")
    );

  const teamAvatars: any = {};

  const getTeamAvatars = rookieTeams.map(async (team: any) => {
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
      rookieTeams,
      teamAvatars,
    },
  };
};
