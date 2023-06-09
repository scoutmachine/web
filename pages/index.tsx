import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { useSession } from "next-auth/react";
import { SignedOutScreen } from "@/components/screens/landing/SignedOut";
import { SignedInScreen } from "@/components/screens/landing/SignedIn";
import { Loading } from "@/components/Loading";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import { getServerSession, Session, User } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { API_URL, COMP_SEASON, CURR_YEAR } from "@/lib/constants";
import { JSX } from "react";
import { FavouritedTeam, Event } from "@prisma/client";
import { Post } from ".prisma/client";
import { SEO } from "@/components/SEO";

export default function LandingPage({
  user,
  avatars,
  teamsCurrentlyCompeting,
  eventsThisWeek,
  totalMatches,
  totalEvents,
  totalRookieTeams,
}: any): JSX.Element {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <SEO />
        <Navbar refresh />

        <SignedInScreen
          session={session}
          favourites={user.favouritedTeams}
          competing={teamsCurrentlyCompeting}
          posts={user.posts}
          avatars={avatars}
          user={user}
          eventsThisWeek={eventsThisWeek}
          totalMatches={totalMatches}
          totalEvents={totalEvents}
          totalRookieTeams={totalRookieTeams}
        />
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <SEO />

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
            `${API_URL}/api/teams/avatar?team=${team.team_number}`,
            {
              next: {
                revalidate: 3600,
              },
            }
          ).then((res: Response) => res.json());

          teamAvatars[team.team_number] = data.avatar;
        })
      );

      if (COMP_SEASON) {
        await Promise.all(
          user?.favouritedTeams.map(
            async (team: FavouritedTeam): Promise<void> => {
              try {
                const data = await fetch(
                  `${API_URL}/api/teams/next?team=${team.team_number}`,
                  {
                    next: {
                      revalidate: 3600,
                    },
                  }
                ).then((res: Response) => res.json());

                teamsCurrentlyCompeting[team.team_number] = data;
              } catch {
                teamsCurrentlyCompeting[team.team_number] = null;
              }
            }
          )
        );
      }
    }

    const currentDate: Date = new Date();

    const formattedDate: string = currentDate.toISOString().slice(0, 10);

    const nextWeekDate: Date = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const formattedNextWeekDate: string = nextWeekDate
      .toISOString()
      .slice(0, 10);

    const eventsThisWeek: Event[] = await db.event.findMany({
      where: {
        start_date: {
          lte: formattedNextWeekDate,
          gte: formattedDate,
        },
      },
    });

    const totalMatches = await db.match.count({
      where: {
        event_key: {
          contains: String(CURR_YEAR),
        },
      },
    });

    const totalEvents = await db.event.count({
      where: {
        year: CURR_YEAR,
      },
    });

    const totalRookieTeams = await db.team.count({
      where: {
        rookie_year: CURR_YEAR,
      },
    });

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        avatars: teamAvatars,
        teamsCurrentlyCompeting,
        eventsThisWeek,
        totalMatches,
        totalEvents,
        totalRookieTeams,
      },
    };
  }

  return { props: {} };
};
