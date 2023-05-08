import router from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "./Modal";
import { useSession } from "next-auth/react";
import { CURR_YEAR } from "@/lib/constants";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const OnboardingBody = () => {
  const { data: session } = useSession();

  const instructions = [
    {
      title: (
        <p>
          Welcome,{" "}
          <span className="text-primary">
            {session?.user?.name?.split(" ")[0]}!
          </span>
        </p>
      ),
      description: (
        <p>
          <span className="text-white font-bold">My name is Griffy</span> &
          I&apos;ve been tasked to be your assistant for today! Let&apos;s go
          over all you need to know about Scout Machine in under 1 min.
        </p>
      ),
    },
    {
      title: "What is this place?",
      description: (
        <p>
          Scout Machine is the all-in-one tool your FRC team needs to find the
          data you want, when you want. From accessing important data points to
          viewing match histories and tracking performance metrics - it&apos;s
          all in one place. <br /> <br />
          <span className="text-white">
            <b>Much love,</b> <br />
            The creators of Scout Machine
          </span>
        </p>
      ),
    },
    {
      title: "Ok, what can I do?",
      description: (
        <p>
          <span className="text-white">
            Well, here are <i>some</i> things:
          </span>
          <li>
            <b className="text-white">/teams</b> (discover new teams)
          </li>
          <li>
            <b className="text-white">/events</b> (all {CURR_YEAR} events)
          </li>
          <li>
            <b className="text-white">/marketplace</b> (buy/sell frc parts)
          </li>
          <li>
            <b className="text-white">/rookies</b> (all {CURR_YEAR} rookie
            teams)
          </li>
          <li>
            <b className="text-white">/fame</b> (view all hall of fame teams)
          </li>
          <li>
            <b className="text-white">/gameday</b> (watch all twitch streams for
            FRC events)
          </li>
        </p>
      ),
    },
    {
      title: "Ready to go!",
      description:
        "You're all set! Now, you're a Scout Machine Pro. Have fun :)",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const isLastPage = currentPage === instructions.length - 1;

  return (
    <>
      <div className="animate-fade-in px-5 py-5">
        <div className="mb-5">
          <h1 className="text-4xl font-bold mb-2 text-white">
            {instructions[currentPage].title}
          </h1>
          <p className="text-lightGray">
            {instructions[currentPage].description}
          </p>
        </div>

        <div className="flex gap-3">
          {currentPage !== 0 && (
            <button
              className="outline-none border border-[#2A2A2A] bg-card text-lightGray py-2 px-4 rounded-lg cursor-pointer hover:border-gray-600 hover:text-white transition-all duration-150"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              Back
            </button>
          )}
          {!isLastPage && (
            <button
              className="outline-none border border-[#2A2A2A] bg-card text-lightGray py-2 px-4 rounded-lg cursor-pointer hover:border-gray-600 hover:text-white transition-all duration-150"
              onClick={handleNextPage}
            >
              Next
            </button>
          )}
          {isLastPage && (
            <button
              className="outline-none bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
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
