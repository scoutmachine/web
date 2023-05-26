import { Navbar } from "@/components/navbar";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import db from "@/lib/db";
import Image from "next/image";
import { User } from "next-auth";
import { formatEpochSecondsToDate } from "@/utils/time";
import { FaCheck, FaCopy, FaTimes } from "react-icons/fa";
import router from "next/router";
import { API_URL } from "@/lib/constants";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function UserProfilePage({ user }: any) {
  const toEpochSeconds: number = new Date(user.createdAt).getTime();
  const [apiKeys, setApiKeys] = useState<string[]>(user.apiKeys || []);

  const notify = (message: string, icon?: React.ReactNode) =>
    toast.custom(() => (
      <div className="flex bg-card px-6 py-4 rounded-lg text-lightGray">
        {icon && <span className="mr-2 mt-[3px]">{icon}</span>}
        {message}
      </div>
    ));

  const handleGenerateApiKey = async () => {
    try {
      const newApiKey = "fefewfwefefwef";
      setApiKeys([...apiKeys, newApiKey]);
      notify("API key generated successfully!", <FaCheck />);
    } catch (error) {
      notify("Failed to generate API key.", <FaTimes/>);
    }
  };

  const handleDeleteApiKey = async (apiKey: string) => {
    try {
      setApiKeys(apiKeys.filter((key) => key !== apiKey)); 
      notify("API key deleted successfully!", <FaCheck />);
    } catch (error) {
      notify("Failed to delete API key.", <FaTimes />);
    }
  };

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
                    onClick={(): void => {
                      notify("Successfully copied to clipboard", <FaCopy />);
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
        <div className="flex items-center mt-8">
          <h2 className="text-xl font-semibold text-white">API Keys</h2>

          <button
            className="ml-auto flex-items-center border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
            onClick={handleGenerateApiKey}
          >
            Generate API Key
          </button>
        </div>
        {apiKeys.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {apiKeys.map((apiKey) => (
              <li key={apiKey} className="flex items-center">
                <code className="bg-gray-800 rounded-lg px-3 py-1 text-sm text-gray-300">
                  {apiKey}
                </code>
                <button
                  className="ml-2 flex items-center bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-md px-2 py-1 transition-colors duration-300 focus:outline-none"
                  onClick={() => handleDeleteApiKey(apiKey)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-400">No API keys generated.</p>
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
  });

  if (!fetchUserData) {
    return { props: {} };
  }

  return { props: { user: JSON.parse(JSON.stringify(fetchUserData)) } };
};
