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
import { API_URL } from "@/lib/constants";

export default function LandingPage({ user, avatars }: any) {
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
          favourites={user.favourited}
          posts={user.posts}
          avatars={avatars}
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
  const session = (await getServerSession(req, res, authOptions)) as Session;

  if (session) {
    const user = await db.user.findUnique({
      where: {
        // @ts-ignore
        id: session.user.id,
      },
      include: {
        favourited: true,
        posts: {
          include: {
            author: true,
          },
        },
      },
    });

    const teamAvatars: any = {};

    if (user?.favourited) {
      await Promise.all(
        user.favourited.map(async (team: any) => {
          const data = await fetch(
            `${API_URL}/api/team/avatar?team=${team.team_number}`
          ).then((res) => res.json());

          teamAvatars[team.team_number] = data.avatar;
        })
      );
    }

    return { props: { user, avatars: teamAvatars } };
  }

  return { props: {} };
};
