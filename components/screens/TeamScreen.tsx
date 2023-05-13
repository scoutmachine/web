import Image from "next/image";
import { FaAward, FaHeart, FaLink, FaStar } from "react-icons/fa";
import { Socials } from "../tabs/team/Socials";
import { useState } from "react";
import { findTeam } from "@/utils/team";
import Link from "next/link";
import { Social } from "../Social";
import { CURR_YEAR } from "@/lib/constants";
import { favouriteTeam, unfavouriteTeam } from "@/utils/favourites";

export const TeamScreen = (props: any) => {
  const [error, setError] = useState(false);
  const isHOF = findTeam(String(props.team.team_number));
  const currentDistrict = props.district
    ? props.district[props.district.length - 1]
    : null;
  const [isStarFilled, setIsStarFilled] = useState(false);

  const isFavourited = props.user.favourited?.some(
    (favouritedTeam: any) =>
      favouritedTeam.team_number === props.team.team_number
  );
  const favouritedTeam = props.user.favourited?.filter(
    (favouritedTeam: any) =>
      favouritedTeam.team_number === props.team.team_number
  );

  return (
    <div className="md:pl-8 md:pr-8 w-full max-w-screen-3xl">
      <div className="border border-[#2a2a2a] bg-[#191919] rounded-lg px-10 py-10 flex flex-col mt-10">
        <div className="relative">
          <div className="md:flex">
            {!error ? (
              <Image
                className="rounded-lg mr-5 w-20 mb-5 md:mb-0"
                alt={`Team ${props.team.team_number} Avatar`}
                height="50"
                width="50"
                priority={true}
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
              />
            ) : (
              <Image
                className="mr-5 w-20 mb-5 md:mb-0"
                alt="FIRST Logo"
                height="50"
                width="50"
                priority={true}
                src={`/first-icon.svg`}
              />
            )}

            <div>
              <p className="text-lightGray text-sm font-medium">
                {props.team.school_name && props.team.school_name}{" "}
              </p>

              <h1 className="font-black text-white text-4xl">
                Team {props.team.team_number}:{" "}
                <span className="text-primary">{props.team.nickname}</span>
              </h1>

              <p className="text-lightGray">
                <b>
                  {props.team.city && `${props.team.city},`}{" "}
                  {props.team.state_prov && `${props.team.state_prov},`}{" "}
                  {props.team.country}
                  {!props.team.city &&
                    !props.team.state_prov &&
                    !props.team.country &&
                    "Unknown Location"}
                </b>{" "}
                • Joined <span>{props.team.rookie_year}</span> •{" "}
                <a
                  href={`https://frc-events.firstinspires.org/team/${props.team.team_number}`}
                  target="_blank"
                >
                  FIRST Inspires
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-5 mt-3">
            {props.team.website && (
              <a href={props.team.website} target="_blank">
                <Social
                  icon={FaLink}
                  name={
                    props.team.website.includes("https")
                      ? props.team.website.replace("https://www.", "")
                      : props.team.website.replace("http://www.", "")
                  }
                  className="text-white font-bold"
                />
              </a>
            )}
            {props.socials && <Socials socials={props.socials} />}
            <div className="flex justify-end md:absolute md:top-0 md:right-0 flex-col">
              {props.user.teamNumber === props.team.team_number && (
                <div className="flex gap-3">
                  <button className="text-sm text-lightGray hover:text-white transition-all duration-150 inline-flex items-center bg-card border border-[#2A2A2A] hover:border-gray-600 rounded-lg px-3 py-1">
                    <FaHeart className="mr-2" />
                    <span>Add Social</span>
                  </button>

                  <button
                    className="text-primary text-sm hover:text-white transition-all duration-150 inline-flex items-center bg-card border border-[#2A2A2A] hover:border-gray-600 rounded-lg px-3 py-1"
                    onClick={() => {
                      if (isFavourited) {
                        unfavouriteTeam(favouritedTeam, true);
                        setIsStarFilled(false);
                      } else {
                        setIsStarFilled(true);
                        favouriteTeam(props.team);
                      }
                    }}
                  >
                    <FaStar className="mr-2" />
                    <span>
                      {isStarFilled || isFavourited
                        ? "Unfavourite"
                        : "Favourite"}{" "}
                      {props.team.team_number}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-[#2A2A2A] rounded-lg py-4 px-6 mt-5">
            {isHOF && (
              <Link href="/fame" legacyBehavior>
                <a>
                  <span className="text-[#ecc729] hover:text-white inline-block">
                    {" "}
                    <span className="flex mb-3 font-black">
                      <FaAward className="text-2xl mr-1" />{" "}
                      <span>Hall of Fame ({isHOF.year})</span>
                    </span>
                  </span>
                </a>
              </Link>
            )}

            <p className="text-white text-sm">
              <span className="font-bold"> District: </span>
              {currentDistrict && (
                <a
                  href={`https://frc-events.firstinspires.org/${CURR_YEAR}/district/${currentDistrict.abbreviation}`}
                  target="_blank"
                >
                  {currentDistrict.display_name}{" "}
                </a>
              )}
              <span className="text-lightGray">
                {currentDistrict
                  ? `(${currentDistrict.abbreviation.toUpperCase()}) `
                  : "N/A"}
              </span>
            </p>

            <p className="text-lightGray font-bold text-sm italic">
              {props.team.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
