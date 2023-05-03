import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import Image from "next/image";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

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
    <h1 className="font-semibold text-xl">Sign up / Scout Machine</h1>
  </>
);

const ModalBody = () => (
  <div className="mt-2 space-y-4">
    <p className="text-sm text-gray-500">
      Thank you for considering using Scout Machine! We appreciate each and
      every one of our users.
    </p>
  </div>
);

const ModalFooter = ({ setOpen }: Props) => (
  <>
    <div className="flex flex-col md:flex-row justify-center items-center gap-2">
      <div className="mt-4">
        <button
          type="button"
          className="flex rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium whitespace-nowrap"
          onClick={() => signIn("google")}
        >
          <FaGoogle className="text-xl mr-2" /> Continue with Google
        </button>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="flex rounded-lg bg-gray-100 hover:bg-gray-300 text-black px-4 py-2 text-sm font-medium whitespace-nowrap"
          onClick={() => signIn("github")}
        >
          <FaGithub className="text-xl mr-2" /> Continue with Github
        </button>
      </div>
    </div>
    <p
      onClick={() => setOpen(false)}
      className="text-xs italic text-lightGray hover:text-primary mt-2 cursor-pointer"
    >
      I want to go back
    </p>
  </>
);

export const SignupModal = ({ isOpen, setOpen }: Props) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-gray-300 bg-[#f0f0f0] p-6 text-center transition-all dark:border-[#2A2A2A] dark:bg-[#191919]">
                  <ModalHeader />
                  <ModalBody />
                  <ModalFooter isOpen={isOpen} setOpen={setOpen} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
