import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "./Modal";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";
import { FaEnvelope, FaSignature, FaUserCircle } from "react-icons/fa";

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
    <h1 className="font-semibold text-xl">Edit Profile</h1>
  </>
);

const ModalBody = ({ setOpen }: any) => {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const updateDisplay = async () => {
    if (displayName.length === 0) {
      setErrorMessage("Display Name left blank");
    } else if (displayName === session?.user?.name) {
      setErrorMessage("That already is your name!");
    } else {
      await fetch(`${API_URL}/api/@me/update`, {
        method: "POST",
        body: JSON.stringify({ name: displayName }),
      });

      reloadSession();
      setOpen(false);
    }
  };

  const updateAvatar = async () => {
    if (avatar.length === 0) {
      setErrorMessage("Avatar URL left blank");
    } else if (avatar === session?.user?.image) {
      setErrorMessage("That already is your avatar!");
    } else {
      await fetch(`${API_URL}/api/@me/update`, {
        method: "POST",
        body: JSON.stringify({ image: avatar }),
      });

      reloadSession();
      setOpen(false);
    }
  };

  return (
    <div className="mt-2">
      <p
        className={`text-sm text-gray-500 mt-[-5px] ${
          errorMessage ? "mb-1" : "mb-5"
        }`}
      >
        Update your account information
      </p>

      {errorMessage && (
        <p className="text-red-500 text-xs mb-5">
          <b>ERROR:</b> {errorMessage}
        </p>
      )}

      <div className="flex flex-col space-y-4">
        <div>
          <p className="uppercase text-xs text-lightGray mb-2">Email</p>
          <Input
            placeholder={session?.user?.email}
            icon={FaEnvelope}
            className="cursor-not-allowed"
            disabled
          />
        </div>

        <div>
          <p className="uppercase text-xs text-lightGray mb-2">Display Name</p>
          <div className="flex gap-x-2">
            <Input
              placeholder={session?.user?.name}
              icon={FaSignature}
              state={setDisplayName}
            />
            <button
              onClick={() => updateDisplay()}
              className="border dark:border-[#2A2A2A] dark:bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
            >
              Update
            </button>
          </div>
        </div>

        <div>
          <p className="uppercase text-xs text-lightGray mb-2">Avatar</p>
          <div className="flex gap-x-2">
            <Input
              placeholder={session?.user?.image}
              icon={FaUserCircle}
              state={setAvatar}
            />
            <button
              onClick={() => updateAvatar()}
              className="border dark:border-[#2A2A2A] dark:bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditProfileModal = ({ isOpen, setOpen }: Props) => {
  return (
    <Modal
      header={<ModalHeader />}
      body={<ModalBody setOpen={setOpen} />}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};
