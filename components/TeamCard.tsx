import { FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { JSX, useState } from "react";
import { favouriteTeam, unfavouriteTeam } from "@/utils/favourites";
import { API_URL } from "@/lib/constants";

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
    <div
      onClick={() => {
        props.setOpen && props.setOpen(true);
        props.setOpenTeam && props.setOpenTeam(props.team);
      }}
      className="relative px-5 py-8 h-32 border bg-white border-solid dark:border-[#2A2A2A] dark:bg-card dark:hover:border-gray-600 rounded-lg"
    >
      <p className="cursor-pointer">
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${API_URL}/api/og/avatar?team=${props.team.team_number}&website=${props.team.website}`}
          height="40"
          width="40"
          alt={`Team ${props.team.team_number} Avatar`}
          className="rounded-lg mb-2 absolute top-5 right-3"
          loading="lazy"
        />

        <h1 className="flex-wrap flex mt-[-15px] text-black dark:text-gray-200 font-extrabold text-lg">
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
      </p>

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
  );
};
