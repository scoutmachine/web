import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Modal } from "./Modal";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";
import { FaBolt, FaEnvelope, FaSignature, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { DragEvent } from "react";
import { IconType } from "react-icons";
import router from "next/router";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const Input = (props: {
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  state?: (e: string) => void;
  icon: IconType;
  primaryPlaceholder?: any;
}) => {
  return (
    <div className="relative w-full">
      <input
        className={`${props.className} ${
          props.disabled && "cursor-not-allowed"
        } w-full border border-[#2A2A2A] bg-card outline-none rounded-lg placeholder-lightGray text-lightGray px-3 py-[6px] text-sm pl-8`}
        type="text"
        disabled={props.disabled ?? false}
        placeholder={props.primaryPlaceholder}
        defaultValue={props.placeholder}
        spellCheck={false}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          props.state?.(e.target.value)
        }
      />
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <props.icon
          className={`text-sm text-lightGray text-${props.className}`}
        />
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
      <h1 className="font-semibold text-xl text-black dark:text-white">
        Edit your profile
      </h1>
    </div>
  );
};

const ModalBody = (props: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  avatar: string;
}) => {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState<string>(
    session?.user?.name as string
  );
  const [avatarURL, setAvatarURL] = useState<string>();
  const [teamNumber, setTeamNumber] = useState<string>(
    // @ts-ignore
    session?.user?.teamNumber as string
  );
  const [errorMessage, setErrorMessage] = useState<string>();
  const [deletedHover, setDeletedHover] = useState(false);

  useEffect((): void => {
    setAvatarURL(props.avatar);
  }, [props.avatar]);

  const fetchUpdate = async (data: object): Promise<void> => {
    await fetch(`${API_URL}/api/@me/update`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    reloadSession();
    props.setOpen(false);
  };

  const reloadSession = (): void => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const updateField = async (
    fieldName: string,
    fieldValue: string | number
  ): Promise<void> => {
    const data: { [p: string]: string | number } = { [fieldName]: fieldValue };
    if (!fieldValue) {
      setErrorMessage(`${fieldName} left blank`);
      // @ts-ignore
    } else if (session?.user[fieldName] === fieldValue) {
      setErrorMessage(`That already is your ${fieldName}!`);
    } else {
      await fetchUpdate(data);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    await fetch(`${API_URL}/api/@me`, {
      method: "DELETE",
    });
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
            placeholder={session?.user?.email as string}
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
              onClick={() => updateField("name", displayName)}
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
              placeholder={avatarURL as string}
              icon={FaUserCircle}
              state={setAvatarURL}
            />
            <button
              onClick={() => updateField("image", avatarURL as string)}
              className="border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
            >
              Update
            </button>
          </div>
        </div>

        <div>
          <p className="uppercase text-xs text-lightGray mb-2">Team Number</p>
          <div className="flex gap-x-2">
            <Input
              placeholder={teamNumber as string}
              icon={FaBolt}
              state={setTeamNumber}
            />
            <button
              onClick={() => updateField("teamNumber", Number(teamNumber))}
              className="border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
            >
              Update
            </button>
          </div>

          <button
            onClick={async (): Promise<void> => {
              await deleteAccount();
              router.reload();
            }}
            onMouseEnter={() => setDeletedHover(true)}
            onMouseLeave={() => setDeletedHover(false)}
            className="text-black dark:text-white bg-red-500 rounded-lg px-3 w-full py-1 mt-5 hover:bg-red-600 text-sm font-bold"
          >
            {deletedHover ? "Are you sure?" : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditProfileModal = ({ isOpen, setOpen }: Props) => {
  const { data: session } = useSession();
  const [imageURL, setImageURL] = useState(session?.user?.image);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const data: string = event.dataTransfer.getData("text/html");
    const doc: Document = new DOMParser().parseFromString(data, "text/html");
    const images: HTMLCollectionOf<HTMLImageElement> =
      doc.getElementsByTagName("img");
    if (images.length > 0) {
      setImageURL(images[0].src);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(event: DragEvent<HTMLDivElement>) => event.preventDefault()}
    >
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
