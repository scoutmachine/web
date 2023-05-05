import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "./Modal";
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Input = (props: any) => {
  return (
    <div className="relative w-full">
      <input
        className={`${props.className} w-full border dark:border-[#2A2A2A] dark:bg-card outline-none rounded-lg placeholder-lightGray text-lightGray px-3 py-[6px] text-sm pl-8`}
        type="text"
        disabled={props.disabled ?? false}
        defaultValue={props.placeholder}
        spellCheck={false}
        onChange={(e) => props.state(e.target.value)}
      />
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <props.icon className="text-sm text-lightGray" />
      </span>
    </div>
  );
};

const ModalHeader = () => (
  <>
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
        Sign out / Scout Machine
      </h1>
    </>
  </>
);

const ModalBody = ({ setOpen }: any) => {
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-500 mt-[-5px] text-center">
        Are you sure you want to sign out of your current session?
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
        <div className="mt-4">
          <button
            type="button"
            className="flex outline-none rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
            onClick={() => signOut()}
          >
            <FaSignOutAlt className="text-xl mr-2" /> Sign Out
          </button>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="flex outline-none rounded-lg bg-gray-100 hover:bg-gray-300 text-black px-4 py-2 text-sm font-medium whitespace-nowrap"
            onClick={() => setOpen(false)}
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export const SignoutModal = ({ isOpen, setOpen }: Props) => {
  return (
    <Modal
      header={<ModalHeader />}
      body={<ModalBody setOpen={setOpen} />}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};
