import Link from "next/link";
import { Tooltip } from "./Toolip";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { API_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import router from "next/router";
import { Loading } from "./Loading";
import {
  favouriteTeam,
  getFavourites,
  unfavouriteTeam,
} from "@/util/favourites";

export const TeamCard = (props: any) => {
  const { data: session } = useSession();
  const [favourites, setFavourites] = useState<any>();
  const isFavourited = favourites?.some(
    (team: any) => team.team_number === props.team.team_number
  );
  const favouritedTeam = favourites?.filter(
    (team: any) => team.team_number === props.team.team_number
  );
  const [isStarFilled, setIsStarFilled] = useState(false);

  useEffect(() => {
    getFavourites(setFavourites);
  }, []);

  if (!isFavourited && props.showFavLoading) return <Loading />;

  const data = {
    team_number: props.team.team_number,
    nickname: props.team.nickname,
    city: props.team.city,
    state_prov: props.team.state_prov,
    country: props.team.country,
    website: props.team.website,
  };

  return (
    <Tooltip team={props.team} avatar={props.avatars[props.team.team_number]}>
      <div className="relative px-5 py-8 h-32 border border-[#2A2A2A] bg-card hover:border-gray-600 rounded-lg">
        <Link href={`/teams/${props.team.team_number}`} legacyBehavior>
          <a className="cursor-pointer">
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
              alt={`Team ${props.team.team_number} Avatar`}
              priority={true}
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
          </a>
        </Link>
        {session && (
          <FaStar
            onClick={() => {
              if (isFavourited) {
                unfavouriteTeam(favouritedTeam);
              } else {
                setIsStarFilled(!isStarFilled);
                favouriteTeam(data);
              }
            }}
            className={`${
              isFavourited || isStarFilled
                ? "fill-primary hover:fill-transparent hover:stroke-primary hover:stroke-[40px]"
                : "fill-transparent stroke-primary stroke-[40px] hover:fill-primary"
            } ml-2 text-xl mt-1 text-lightGray hover:text-primary absolute bottom-3 right-3 cursor-pointer`}
          />
        )}
      </div>
    </Tooltip>
  );
};
