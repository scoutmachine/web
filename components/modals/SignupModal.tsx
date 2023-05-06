import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import Image from "next/image";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Modal } from "./Modal";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ModalHeader = () => (
  <>
    <div className="mb-2 flex justify-center">
      <Image
        src="/smLogo.png"
        height={50}
        width={50}
        alt="Scout Machine Logo"
        priority={true}
      />
    </div>
    <h1 className="font-semibold text-xl text-center">
      Sign up / Scout Machine
    </h1>
  </>
);

const ModalBody = () => (
  <div className="mt-2 space-y-4 text-center">
    <p className="text-sm text-gray-500">
      Thank you for considering using Scout Machine! We appreciate each and
      every one of our users.
    </p>
  </div>
);

const ModalFooter = ({ setOpen }: any) => (
  <>
    <div className="flex flex-col md:flex-row justify-center items-center gap-2">
      <div className="mt-4">
        <button
          type="button"
          className="flex rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
          onClick={async () => {
            localStorage.getItem("signUpState")
              ? null
              : localStorage.setItem("signUpState", "in");
            await signIn("google");
          }}
        >
          <FaGoogle className="text-xl mr-2" /> Continue with Google
        </button>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="flex rounded-lg bg-gray-100 hover:bg-gray-300 text-black px-4 py-2 text-sm font-medium whitespace-nowrap"
          onClick={async () => {
            localStorage.getItem("signUpState")
              ? null
              : localStorage.setItem("signUpState", "in");
            await signIn("github");
          }}
        >
          <FaGithub className="text-xl mr-2" /> Continue with Github
        </button>
      </div>
    </div>
    <p
      onClick={() => setOpen(false)}
      className="text-xs italic text-lightGray hover:text-primary mt-2 cursor-pointer text-center"
    >
      I want to go back
    </p>
  </>
);

export const SignupModal = ({ isOpen, setOpen }: Props) => {
  return (
    <Modal
      header={<ModalHeader />}
      body={<ModalBody />}
      footer={<ModalFooter setOpen={setOpen} />}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};
