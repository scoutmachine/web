import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "./Modal";
import Image from "next/image";
import { Socials } from "@/lib/lists/socials";
import { API_URL } from "@/lib/constants";
import { Input } from "./EditProfileModal";
import router from "next/router";

type SocialInput = {
  handle: string;
  type: string;
};

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: any;
  avatar: any;
};

const AddSocialButton = (props: any) => {
  const handleClick = async () => {
    const requestData = props.socialInputs.map((input: SocialInput) => ({
      handle: input.handle,
      type: input.type,
    }));

    await fetch(
      `${API_URL}/api/team/socials/add?team=${props.team.team_number}`,
      {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    router.reload();
  };

  return (
    <button
      onClick={handleClick}
      className="mt-3 border border-[#2A2A2A] bg-card px-3 rounded-lg py-1 text-lightGray text-sm hover:border-gray-600"
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

const ModalBody = (props: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  team: any;
}) => {
  const [socialInputs, setSocialInputs] = useState<SocialInput[]>([]);

  const handleInputChange = (key: string, value: string, type: string) => {
    setSocialInputs((prevInputs) => {
      const updatedInputs = prevInputs.map((input) => {
        if (input.type === type) {
          return { ...input, handle: value };
        }
        return input;
      });

      if (!updatedInputs.some((input) => input.type === type)) {
        return [...updatedInputs, { handle: value, type }];
      }

      return updatedInputs;
    });
  };

  return (
    <div className="flex flex-col mt-6 gap-3">
      {Socials.map((social: any, key: any) => {
        return (
          <div key={key} className="flex gap-x-2">
            <Input
              primaryPlaceholder={social.name}
              icon={social.icon}
              state={(value) =>
                handleInputChange(social.name, value, social.name.toLowerCase())
              }
            />
          </div>
        );
      })}

      <AddSocialButton
        text={`Add ${socialInputs.length < 1 ? "Socials" : ""}${socialInputs
          .filter((social) => social.handle.length > 0)
          .map((social, index, array) => {
            const socialType =
              social.type.charAt(0).toUpperCase() + social.type.slice(1);
            if (index === array.length - 1) {
              if (array.length === 1) {
                return socialType;
              } else if (array.length > 1) {
                return `and ${socialType}`;
              } else {
                return `, ${socialType}`;
              }
            }
            return socialType;
          })
          .join(", ")}`}
        team={props.team}
        teamNumber={props.team.team_number}
        socialInputs={socialInputs}
      />
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
