import { Navbar } from "@/components/navbar";
import { GetServerSideProps } from "next";
import Head from "next/head";
import db from "@/lib/db";

export default function UserProfilePage({ user }: any) {
  return (
    <>
      <Head>
        <title>{user.name} | Scout Machine</title>
      </Head>

      <Navbar />

      <h1>{user.name}</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username }: any = context.params;

  const fetchUserData = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!fetchUserData) {
    return { props: {} };
  }

  return { props: { user: fetchUserData } };
};
