import team from "@/pages/api/team";
import Link from "next/link";
import { Tooltip } from "./Toolip";
import Image from "next/image";

export const TeamCard = (props: any) => {
  return (
    <Tooltip team={props.team}>
      <Link href={`/teams/${props.team.team_number}`} legacyBehavior>
        <a>
          <div className="relative px-5 py-8 h-32 border dark:border-[#2A2A2A] dark:bg-card hover:border-gray-600 rounded-lg">
            <Image
              src={
                props.avatars[props.team.team_number]
                  ? `data:image/jpeg;base64,${
                      props.avatars[props.team.team_number]
                    }`
                  : "/first-icon.svg"
              }
              height="40"
              width="40"
              alt=""
              className="rounded-lg mb-2 absolute top-5 right-3"
            />

            <h1 className="flex-wrap flex mt-[-15px] text-gray-200 font-extrabold text-lg">
              {props.team.nickname.length > 20
                ? `${props.team.nickname.slice(0, 20)}...`
                : props.team.nickname}
            </h1>
            <p className="text-lightGray text-sm">
              {props.team.city
                ? `${
                    props.team.city.length > 20
                      ? `${props.team.city.slice(0, 20)}`
                      : props.team.city
                  }, ${props.team.state_prov}, ${props.team.country}`
                : "No location"}
            </p>

            <p className="absolute bottom-3 text-lightGray font-medium text-base sm:text-lg">
              # {props.team.team_number}
            </p>
          </div>
        </a>
      </Link>
    </Tooltip>
  );
};
