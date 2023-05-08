import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal } from "./Modal";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";
import {
  FaBolt,
  FaDollarSign,
  FaFire,
  FaSignature,
  FaUserCircle,
} from "react-icons/fa";
import { IconType } from "react-icons";
import router from "next/router";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Input = (props: {
  className?: string;
  placeholder: string;
  state?: (e: string) => void;
  icon: IconType;
}) => {
  return (
    <div className="relative w-full">
      <input
        className={`${props.className} w-full border border-[#2A2A2A] bg-card outline-none rounded-lg placeholder-lightGray text-lightGray px-3 py-[6px] text-sm pl-8`}
        type="text"
        placeholder={props.placeholder}
        spellCheck={false}
        onChange={(e) => props.state?.(e.target.value)}
      />
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <props.icon className="text-sm text-lightGray" />
      </span>
    </div>
  );
};

const ModalHeader = () => {
  return (
    <h1 className="font-semibold text-xl">
      Create a Listing <span className="text-primary">/ Marketplace</span>
    </h1>
  );
};

const ModalBody = (props: { setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createListing = async () => {
    const data = {
      title: title,
      content: description,
      price: price,
    };

    await fetch(`${API_URL}/api/@me/post`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then(async (res) => {
      const data = await res.json();
      router.push(`/marketplace/${data.id}`);
    });
  };

  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
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
          <p className="uppercase text-xs text-lightGray mb-2">Listing Title</p>
          <div className="flex gap-x-2">
            <Input placeholder="Title" icon={FaFire} state={setTitle} />
          </div>
        </div>

        <div>
          <p className="uppercase text-xs text-lightGray mb-2">
            Listing Description
          </p>
          <div className="flex gap-x-2">
            <Input
              placeholder="Description"
              icon={FaBolt}
              state={setDescription}
            />
          </div>
        </div>

        <div>
          <p className="uppercase text-xs text-lightGray mb-2">Listing Price</p>
          <div className="flex gap-x-2">
            <Input placeholder="Price" icon={FaDollarSign} state={setPrice} />
          </div>
        </div>

        <button
          className="border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
          onClick={() => createListing()}
        >
          Create Listing
        </button>
      </div>
    </div>
  );
};

export const CreateListingModal = ({ isOpen, setOpen }: Props) => {
  return (
    <Modal
      header={<ModalHeader />}
      body={<ModalBody setOpen={setOpen} />}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};
