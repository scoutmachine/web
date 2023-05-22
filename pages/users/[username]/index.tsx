import { Navbar } from "@/components/navbar";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import db from "@/lib/db";
import Image from "next/image";
import { User } from "next-auth";
import { formatEpochSecondsToDate } from "@/utils/time";
import { FaCopy } from "react-icons/fa";
import router from "next/router";
import { API_URL } from "@/lib/constants";
import toast, { Toaster } from "react-hot-toast";

export default function UserProfilePage({ user }: any) {
  const toEpochSeconds: number = new Date(user.createdAt).getTime();

  const notify = () =>
    toast.custom(() => (
      <div className={`flex bg-card px-6 py-4 rounded-lg text-lightGray`}>
        <FaCopy className="mr-2 mt-[3px]" /> Successfully copied to clipboard
      </div>
    ));

  return (
    <>
      <Head>
        <title>{user.name} | Scout Machine</title>
      </Head>

      <Navbar />

      <div className="pl-4 pr-4 md:pl-8 md:pr-8 w-full max-w-screen-3xl">
        <div className="border border-[#2a2a2a] bg-[#191919] rounded-lg px-10 py-10 flex flex-col mt-10">
          <div className="md:flex">
            <Image
              className="mr-5 mb-5 md:mb-0 rounded-lg"
              alt="FIRST Logo"
              height="50"
              width="85"
              priority={true}
              src={user.image}
            />

            <div>
              <h1 className="font-black text-black dark:text-white text-4xl">
                {user.name}
              </h1>

              <p className="text-lightGray">
                <b>
                  {user.teamNumber ? `Team ${user.teamNumber}` : "Unknown Team"}
                </b>{" "}
                • Joined {formatEpochSecondsToDate(toEpochSeconds, true)} <br />{" "}
                <span className="text-sm flex">
                  @{user.username}{" "}
                  <FaCopy
                    className="ml-2 mt-[3px] text-xs cursor-pointer hover:text-white"
                    onClick={() => {
                      notify();
                      navigator.clipboard.writeText(
                        `${API_URL}${router.asPath}`
                      );
                    }}
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<any> => {
  const { username }: any = context.params;

  const fetchUserData: User | null = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!fetchUserData) {
    return { props: {} };
  }

  return { props: { user: JSON.parse(JSON.stringify(fetchUserData)) } };
};
