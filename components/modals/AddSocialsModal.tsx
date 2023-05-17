import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "./Modal";
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaInstagram,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Image from "next/image";
import { Input } from "./EditProfileModal";
import router from "next/router";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: any;
  avatar: any;
};

const AddSocialButton = (props: { text?: string }) => {
  return (
    <button
      onClick={() => router.reload()}
      className="border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
    >
      {props.text ?? "Add"}
    </button>
  );
};

const ModalHeader = (props: { team: any; avatar: any }) => {
  const [error, setError] = useState(false);

  return (
    <div className="flex">
      <Image
        src={
          props.avatar
            ? `data:image/jpeg;base64,${props.avatar}`
            : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
                props.team.website?.startsWith("https")
                  ? props.team.website
                  : `https://${props.team.website?.slice(7)}`
              }/&size=64`
        }
        onError={() => {
          setError(true);
        }}
        height="25"
        width="40"
        className="mr-2"
        alt={`${props.team.team_number} Avatar`}
      />
      <h1 className="font-semibold text-xl">
        Add Socials
        <p className="text-xs text-lightGray font-medium">
          {props.team.team_number} | {props.team.nickname}
        </p>
      </h1>
    </div>
  );
};

const Socials = [
  {
    name: "Support Email",
    icon: FaEnvelope,
  },
  {
    name: "Instagram",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    icon: FaFacebook,
  },
  {
    name: "Twitter",
    icon: FaTwitter,
  },
  {
    name: "GitHub",
    icon: FaGithub,
  },
  {
    name: "Gitlab",
    icon: FaGitlab,
  },
  {
    name: "Tiktok",
    icon: FaTiktok,
  },
  {
    name: "Twitch",
    icon: FaTwitch,
  },
];

const ModalBody = (props: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: any;
}) => {
  return (
    <div className="flex flex-col mt-6 gap-4">
      {Socials.map((social: any, key: any) => {
        return (
          <div key={key} className="flex gap-x-2">
            <Input primaryPlaceholder={social.name} icon={social.icon} />
            <AddSocialButton />
          </div>
        );
      })}

      <AddSocialButton text="Add All" />
    </div>
  );
};

export const AddSocialsModal = ({ isOpen, setOpen, team, avatar }: Props) => {
  return (
    <Modal
      header={<ModalHeader team={team} avatar={avatar} />}
      body={<ModalBody setOpen={setOpen} team={team} />}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
};
