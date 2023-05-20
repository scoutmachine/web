import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { SignedOutScreen } from "@/components/screens/landing/SignedOut";
import { SignedInScreen } from "@/components/screens/landing/SignedIn";
import { Loading } from "@/components/Loading";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import {API_URL} from "@/lib/constants";
import {JSX} from "react";

export default function LandingPage({user, avatars}: any): JSX.Element {
    const {data: session, status} = useSession();

    if (status === "loading") return <Loading/>;

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
          posts={user.posts}
          avatars={avatars}
          user={user}
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session: Session = (await getServerSession(req, res, authOptions)) as Session;

  if (session) {
    const user = await db.user.findUnique({
      where: {
        // @ts-ignore
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

    const teamAvatars: any = {};

    if (user?.favouritedTeams) {
      await Promise.all(
          user.favouritedTeams.map(async (team: any): Promise<void> => {
              const data = await fetch(
                  `${API_URL}/api/team/avatar?team=${team.team_number}`
              ).then((res: Response) => res.json());

              teamAvatars[team.team_number] = data.avatar;
          })
      );
    }

    return { props: { user, avatars: teamAvatars } };
  }

  return { props: {} };
};
