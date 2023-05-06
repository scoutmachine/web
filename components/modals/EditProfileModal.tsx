import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";
import { FaEnvelope, FaSignature, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { DragEvent } from "react";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Input = (props: any) => {
  return (
    <div className="relative w-full">
      <input
        className={`${props.className} w-full border border-[#2A2A2A] bg-card outline-none rounded-lg placeholder-lightGray text-lightGray px-3 py-[6px] text-sm pl-8`}
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

const ModalHeader = (props: { avatar: string }) => {
  return (
    <div className="flex">
      <Image
        src={props.avatar}
        height="25"
        width="30"
        className="rounded-full mr-2"
        alt="Avatar"
      />
      <h1 className="font-semibold text-xl">Edit your profile</h1>
    </div>
  );
};

const ModalBody = ({ setOpen, avatar }: any) => {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState(session?.user?.name);
  const [avatarURL, setAvatarURL] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    setAvatarURL(avatar);
  }, [avatar]);

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const updateDisplay = async () => {
    if (displayName?.length === 0) {
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
    if (avatarURL?.length === 0) {
      setErrorMessage("Avatar URL left blank");
    } else if (avatarURL === session?.user?.image) {
      setErrorMessage("That already is your avatar!");
    } else {
      await fetch(`${API_URL}/api/@me/update`, {
        method: "POST",
        body: JSON.stringify({ image: avatarURL }),
      });

      reloadSession();
      setOpen(false);
    }
  };

  return (
    <div className="mt-5">
      {errorMessage && (
        <div className="border border-[#2A2A2A] bg-card rounded-lg px-2 py-2 mt-[-5px] mb-5">
          <p className="text-red-500 text-xs">
            <b>ERROR:</b> {errorMessage}
          </p>
        </div>
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
              placeholder={displayName}
              icon={FaSignature}
              state={setDisplayName}
            />
            <button
              onClick={() => updateDisplay()}
              className="border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
            >
              Update
            </button>
          </div>
        </div>

        <div>
          <p className="uppercase text-xs text-lightGray mb-2">Avatar</p>
          <div className="flex gap-x-2">
            <Input
              placeholder={avatarURL}
              icon={FaUserCircle}
              state={setAvatarURL}
            />
            <button
              onClick={() => updateAvatar()}
              className="border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
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
  const { data: session } = useSession();
  const [imageURL, setImageURL] = useState(session?.user?.image);

  const handleFileInput = (event: any) => {
    const imageURL = URL.createObjectURL(event.target.files[0]);
    setImageURL(imageURL);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const items = event.dataTransfer.items;
    if (items) {
      for (let item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          handleFileInput({ target: { files: [file] } });
          break;
        }
      }
    } else {
      const data = event.dataTransfer.getData("text/html");
      const doc = new DOMParser().parseFromString(data, "text/html");
      const images = doc.getElementsByTagName("img");
      if (images.length > 0) {
        setImageURL(images[0].src);
      }
    }
  };

  return (
    <div onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
      <Modal
        header={<ModalHeader avatar={imageURL as string} />}
        body={<ModalBody setOpen={setOpen} avatar={imageURL as string} />}
        isOpen={isOpen}
        setOpen={setOpen}
        onClose={() => setImageURL(session?.user?.image)}
      />
    </div>
  );
};
