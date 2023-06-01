import { Navbar } from "@/components/navbar";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import { User } from "next-auth";
import { formatEpochSecondsToDate } from "@/utils/time";
import { FaCheck, FaCopy, FaTimes } from "react-icons/fa";
import { API_URL } from "@/lib/constants";
import toast, { Toaster } from "react-hot-toast";
import router from "next/router";
import db from "@/lib/db";
import { useSession } from "next-auth/react";

export default function UserProfilePage({ user }: any) {
  const toEpochSeconds: number = new Date(user.createdAt).getTime();
  const { data: session } = useSession();

  const notify = (message: string, icon?: React.ReactNode) =>
    toast.custom(() => (
      <div className="flex bg-card px-6 py-4 rounded-lg text-lightGray">
        {icon && <span className="mr-2 mt-[3px]">{icon}</span>}
        {message}
      </div>
    ));

  const handleGenerateApiKey = async (): Promise<void> => {
    try {
      await fetch("/api/@me/apiKeys", { method: "POST" }).then((res: Response) =>
        res.json()
      );
      router.push(router.asPath);
      notify("API key generated successfully!", <FaCheck />);
    } catch (error) {
      notify("Failed to generate API key.", <FaTimes />);
    }
  };

  const handleDeleteApiKey = async (apiKey: string): Promise<void> => {
    try {
      await fetch(`/api/@me/apiKeys?apiKey=${encodeURIComponent(apiKey)}`, {
        method: "DELETE",
      });

      router.push(router.asPath);
      notify("API key deleted successfully!", <FaCheck />);
    } catch (error) {
      notify("Failed to delete API key.", <FaTimes />);
    }
  };

  const handleCopyApiKey = (apiKey: string): void => {
    navigator.clipboard
      .writeText(apiKey)
      .then((): void => {
        notify("API key copied to clipboard!", <FaCheck />);
      })
      .catch((): void => {
        notify("Failed to copy API key.", <FaTimes />);
      });
  };

  const isOwnProfile: boolean | null = session && user.username == session.user.username;

  return (
    <>
      <Head>
        <title>{user.name} | Scout Machine</title>
      </Head>

      <Navbar />

      <div className="pl-4 pr-4 md:pl-8 md:pr-8 w-full max-w-screen-3xl">
        <div className="border bg-white border-solid dark:border-[#2A2A2A] dark:bg-card rounded-lg px-10 py-10 flex flex-col mt-10">
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
                    onClick={async (): Promise<void> => {
                      notify("Successfully copied to clipboard", <FaCopy />);
                      await navigator.clipboard.writeText(
                        `${API_URL}${router.asPath}`
                      );
                    }}
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
        {isOwnProfile && (
          <>
            <div className="flex items-center mt-8">
              <h2 className="text-xl font-bold text-black dark:text-white ">
                API Keys
              </h2>

              <button
                className="ml-auto flex-items-center border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
                onClick={handleGenerateApiKey}
              >
                Generate API Key
              </button>
            </div>
            {user.apiKeys.length > 0 ? (
              <ul className="mt-4 gap-3 gap-x-3 flex flex-wrap">
                {user.apiKeys.map((apiKey: any) => (
                  <li key={apiKey.id} className="flex items-center">
                    <code className="border-[#2A2A2A] bg-card rounded-lg px-3 py-1 text-sm text-gray-300">
                      {apiKey.key}
                      <button
                        className="ml-2 bg-transparent border-none p-1 cursor-pointer"
                        onClick={() => handleCopyApiKey(apiKey.key)}
                      >
                        <FaCopy />
                      </button>
                    </code>
                    <button
                      className="ml-2 flex items-center bg-red-500 hover:bg-red-400 text-white text-sm font-medium rounded-md px-5 py-1 transition-colors duration-300 focus:outline-none"
                      onClick={() => handleDeleteApiKey(apiKey.key)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-gray-400">
                Looks like you haven&apos;t generated any API Keys, yet.
              </p>
            )}
          </>
        )}
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
    include: {
      apiKeys: true,
    },
  });

  if (!fetchUserData) {
    return { props: {} };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(fetchUserData)),
    },
  };
};
