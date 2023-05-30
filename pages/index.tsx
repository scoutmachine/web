import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { SignedOutScreen } from "@/components/screens/landing/SignedOut";
import { SignedInScreen } from "@/components/screens/landing/SignedIn";
import { Loading } from "@/components/Loading";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import { getServerSession, Session, User } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { API_URL, COMP_SEASON } from "@/lib/constants";
import { JSX } from "react";
import { FavouritedTeam } from "@prisma/client";
import { Post } from ".prisma/client";

export default function LandingPage({
  user,
  avatars,
  teamsCurrentlyCompeting,
  eventsThisWeek,
}: any): JSX.Element {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <Head>
          <title>Scout Machine</title>
        </Head>

        <Navbar refresh />
        <SignedInScreen
          session={session}
          favourites={user.favouritedTeams}
          competing={teamsCurrentlyCompeting}
          posts={user.posts}
          avatars={avatars}
          user={user}
          eventsThisWeek={eventsThisWeek}
        />
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Scout Machine</title>
        </Head>

        <Navbar />
        <SignedOutScreen />
        <Footer />
      </>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}): Promise<{ props: { user: any; avatars: any } } | { props: {} }> => {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  if (session) {
    const user:
      | (User & {
          favouritedTeams: FavouritedTeam[];
          posts: (Post & { author: User })[];
        })
      | null = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        favouritedTeams: true,
        posts: {
          include: {
            author: true,
          },
        },
      },
    });

    const teamsCurrentlyCompeting: any = {};
    const teamAvatars: any = {};

    if (user?.favouritedTeams) {
      await Promise.all(
        user.favouritedTeams.map(async (team: any): Promise<void> => {
          const data = await fetch(
            `${API_URL}/api/teams/avatar?team=${team.team_number}`
          ).then((res: Response) => res.json());

          teamAvatars[team.team_number] = data.avatar;
        })
      );

      if (COMP_SEASON) {
        await Promise.all(
          user?.favouritedTeams.map(async (team) => {
            try {
              const data = await fetch(
                `${API_URL}/api/teams/next?team=${team.team_number}`
              ).then((res) => res.json());

              teamsCurrentlyCompeting[team.team_number] = data;
            } catch {
              teamsCurrentlyCompeting[team.team_number] = null;
            }
          })
        );
      }
    }

    const currentDate = new Date();

    const formattedDate = currentDate.toISOString().slice(0, 10);

    const nextWeekDate = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const formattedNextWeekDate = nextWeekDate.toISOString().slice(0, 10);

    const eventsThisWeek = await db.event.findMany({
      where: {
        start_date: {
          lte: formattedNextWeekDate,
          gte: formattedDate,
        },
      },
    });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        avatars: teamAvatars,
        teamsCurrentlyCompeting,
        eventsThisWeek,
      },
    };
  }

  return { props: {} };
};
