import router from "next/router";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import { Modal } from "./Modal";
import { useSession } from "next-auth/react";
import { CURR_YEAR, DISCORD_URL, GITHUB_URL } from "@/lib/constants";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const OnboardingBody = () => {
  const { data: session } = useSession();

  const instructions: (
    | { title: JSX.Element; description: JSX.Element }
    | { title: string; description: JSX.Element }
    | { title: string; description: string }
  )[] = [
    {
      title: (
        <p>
          Hi there,{" "}
          <span className="text-primary">
            {session?.user?.name?.split(" ")[0]}.
          </span>
        </p>
      ),
      description: (
        <p>
          We&apos;re so excited to have you here. By the end of this,
          you&apos;ll learn everything you need to know about{" "}
          <span className="text-primary">Scout Machine!</span> <br /> <br />
          Press{" "}
          <span className="bg-card py-1 px-2 rounded font-semibold">
            Next
          </span>{" "}
          & let&apos;s get the party started.
        </p>
      ),
    },
    {
      title: <p className="text-primary">What is this place?</p>,
      description: (
        <p>
          Scout Machine is the all-in-one tool your FRC team needs to find the
          data you want, when you want. From accessing important data points to
          viewing match histories and tracking performance metrics - it&apos;s
          all in one place. <br /> <br />
          <span className="text-black dark:text-white">
            <b>Much love,</b> <br />
            The creators of Scout Machine
          </span>
        </p>
      ),
    },
    {
      title: <p className="text-primary">Ok, what can I do?</p>,
      description: (
        <p>
          <span className="text-black dark:text-white">
            Well, here are <i>some</i> things:
          </span>
          <li>
            <b className="text-black dark:text-white">/teams</b> (discover new
            teams)
          </li>
          <li>
            <b className="text-black dark:text-white">/events</b> (all{" "}
            {CURR_YEAR} events)
          </li>
          <li>
            <b className="text-black dark:text-white">/marketplace</b> (buy/sell
            frc parts)
          </li>
          <li>
            <b className="text-black dark:text-white">/rookies</b> (all{" "}
            {CURR_YEAR} rookie teams)
          </li>
          <li>
            <b className="text-black dark:text-white">/fame</b> (view all hall
            of fame teams)
          </li>
          <li>
            <b className="text-black dark:text-white">/gameday</b> (watch all
            twitch streams for FRC events)
          </li>
        </p>
      ),
    },
    {
      title: <p className="text-primary">Ready to go</p>,
      description: (
        <p>
          You&apos;re now a Scout Machine Expert. Have fun out there! <br />
          <br /> Remember, if you have any questions, bug reports, feature
          requests, or anything else, you can always reach out to us via{" "}
          <a
            className="text-purple-400"
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>{" "}
          or{" "}
          <a
            className="text-white"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>{" "}
          & we&apos;ll be happy to help.
        </p>
      ),
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = (): void => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = (): void => {
    setCurrentPage(currentPage - 1);
  };

  const isLastPage: boolean = currentPage === instructions.length - 1;

  return (
    <>
      <div className="onboardingFadeIn px-5 py-5">
        <div className="mb-5">
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">
            {instructions[currentPage].title}
          </h1>
          <p className="text-lightGray">
            {instructions[currentPage].description}
          </p>
        </div>

        <div className="flex gap-3">
          {currentPage !== 0 && (
            <button
              className="outline-none border border-[#2A2A2A] bg-card text-lightGray py-2 px-4 rounded-lg cursor-pointer hover:border-gray-600 hover:text-black dark:hover:text-white text-lightGray transition-all duration-150"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              Back
            </button>
          )}
          {!isLastPage && (
            <button
              className="outline-none border border-[#2A2A2A] bg-card text-lightGray py-2 px-4 rounded-lg cursor-pointer hover:border-gray-600 hover:text-black dark:hover:text-white text-lightGray transition-all duration-150"
              onClick={handleNextPage}
            >
              Next
            </button>
          )}
          {isLastPage && (
            <button
              className="outline-none bg-green-500 hover:bg-green-700 text-black dark:text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => router.push("/")}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export const OnboardingModal = ({ isOpen, setOpen }: Props) => {
  return (
    <Modal
      body={<OnboardingBody />}
      isOpen={isOpen}
      setOpen={setOpen}
      noClose
    />
  );
};
