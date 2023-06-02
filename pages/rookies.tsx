import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Navbar } from "@/components/navbar";
import { TeamCard } from "@/components/TeamCard";
import { API_URL, CURR_YEAR } from "@/lib/constants";
import { getStorage, setStorage } from "@/utils/localStorage";
import { formatTime } from "@/utils/time";
import { JSX, useEffect, useState } from "react";
import { FaBolt } from "react-icons/fa";
import Head from "next/head";
import { log } from "@/utils/log";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import { getServerSession, Session, User } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { FavouritedTeam } from "@prisma/client";

export default function RookiesPage({
  user,
  rookieTeams,
  avatars,
}: any): JSX.Element {
  return (
    <>
      <Head>
        <title>Rookies | Scout Machine</title>
      </Head>

      <Navbar active="Rookie Teams" />

      <Header
        className="flex"
        title={
          <p className="mb-2 text-3xl font-black md:flex md:text-5xl text-primary">
            <FaBolt className="mr-3 md:ml-0 ml-[-10px] md:mb-0 mb-3 w-[50px]" />
            <span className="mr-1 italic md:mr-3">FIRST</span> Rookie Teams
          </p>
        }
        desc={
          <p>
            Get ready to meet the fresh new faces of{" "}
            <span className="italic">FIRST</span> Robotics for {CURR_YEAR}! With
            over{" "}
            <span className="font-bold text-black dark:text-white">
              {rookieTeams.length}
            </span>{" "}
            rookie teams joining the competition this year, the excitement is at
            an all-time high. We&apos;re thrilled to highlight these
            up-and-coming teams and give them the recognition they deserve.{" "}
            <br /> <br />
            From the entire <span className="italic">FIRST</span> community,
            welcome!
          </p>
        }
      />

      <div className="w-full pl-4 pr-4 mx-auto md:pr-8 md:pl-8">
        <div className="flex flex-col w-full gap-3 mt-10 sm:grid sm:grid-cols-2 lg:grid-cols-5">
          {Array.isArray(rookieTeams) &&
            rookieTeams.map((team: any, key: number) => {
              return (
                <TeamCard
                  key={key}
                  team={team}
                  avatars={avatars}
                  favourites={user?.favouritedTeams}
                />
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
}): Promise<{ props: { user: any } } | { props: {} }> => {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  const rookieTeams = await db.team.findMany({
    where: {
      rookie_year: CURR_YEAR,
    },
  });

  const teamAvatars: any = {};

  const getTeamAvatars = rookieTeams.map(async (team: any): Promise<void> => {
    try {
      const response: Response = await fetch(
        `${API_URL}/api/teams/avatar?team=${team.team_number}`
      );
      const data = await response.json();
      teamAvatars[team.team_number] = data.avatar;
    } catch (error) {
      teamAvatars[team.team_number] = null;
    }
  });

  await Promise.all(getTeamAvatars);

  if (session) {
    const user: (User & { favouritedTeams: FavouritedTeam[] }) | null =
      await db.user.findUnique({
        where: {
          id: session.user.id,
        },
        include: {
          favouritedTeams: true,
        },
      });

    return {
      props: {
        rookieTeams,
        avatars: teamAvatars,
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  }

  return { props: { rookieTeams, avatars: teamAvatars } };
};
