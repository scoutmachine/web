import Link from "next/link";
import { Tooltip } from "./Tooltip";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { JSX, useState } from "react";
import { favouriteTeam, unfavouriteTeam } from "@/utils/favourites";

const PlaceholderTeamCard = () => {
  return (
    <div className="relative px-5 py-8 h-32 border border-[#2A2A2A] bg-card hover:border-gray-600 rounded-lg">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-[#2A2A2A] h-10 w-10 absolute top-5 right-3"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-2 bg-[#2A2A2A] rounded w-5/6"></div>
          <div className="h-2 bg-[#2A2A2A] rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export const TeamCard = (props: any): JSX.Element => {
  const { data: session } = useSession();
  const [error, setError] = useState(false);
  const isFavourited = props.favourites?.some(
    (team: any): boolean => team.team_number === props.team.team_number
  );
  const favouritedTeam = props.favourites?.filter(
    (team: any): boolean => team.team_number === props.team.team_number
  );
  const [isStarFilled, setIsStarFilled] = useState(false);

  const data: {
    team_number: number;
    nickname: string | null;
    city: string | null;
    state_prov: string | null;
    country: string | null;
    website: string | null;
    rookie_year: number;
  } = {
    team_number: props.team.team_number,
    nickname: props.team.nickname,
    city: props.team.city,
    state_prov: props.team.state_prov,
    country: props.team.country,
    website: props.team.website,
    rookie_year: props.team.rookie_year,
  };

  if (!isFavourited && props.showFavLoading) return <PlaceholderTeamCard />;

  return (
    <Tooltip
      team={props.team}
      avatar={props.avatars && props.avatars[props.team.team_number]}
    >
      <div className="relative px-5 py-8 h-32 border border-[#2A2A2A] bg-card hover:border-gray-600 rounded-lg">
        <Link href={`/teams/${props.team.team_number}`} legacyBehavior>
          <a className="cursor-pointer">
            {!error ? (
              <Image
                src={
                  props.avatars && props.avatars[props.team.team_number]
                    ? `data:image/jpeg;base64,${
                        props.avatars[props.team.team_number]
                      }`
                    : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
                        props.team.website?.startsWith("https")
                          ? props.team.website
                          : `https://${props.team.website?.slice(7)}`
                      }/&size=64`
                }
                onError={() => {
                  setError(true);
                }}
                height="40"
                width="40"
                alt={`Team ${props.team.team_number} Avatar`}
                priority={true}
                className="rounded-lg mb-2 absolute top-5 right-3"
              />
            ) : (
              <Image
                className="rounded-lg mb-2 absolute top-5 right-3"
                height="40"
                width="40"
                alt={`Team ${props.team.team_number} Avatar`}
                priority={true}
                src="/first-icon.svg"
              />
            )}

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
          </a>
        </Link>
        {session && (
          <FaStar
            onClick={(): void => {
              if (isFavourited) {
                unfavouriteTeam(favouritedTeam);
              } else {
                setIsStarFilled(!isStarFilled);
                favouriteTeam(data);
              }
            }}
            className={`${
              isFavourited || isStarFilled
                ? "fill-primary hover:fill-transparent hover:stroke-primary hover:stroke-[40px] transition duration-300 popStar"
                : "fill-transparent stroke-primary stroke-[40px] hover:fill-primary transition duration-300 popStar"
            } ml-2 text-xl mt-1 text-lightGray hover:text-primary absolute bottom-3 right-3 cursor-pointer`}
          />
        )}
      </div>
    </Tooltip>
  );
};
