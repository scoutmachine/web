import Image from "next/image";
import { FaAward, FaInfoCircle, FaLink, FaPlus, FaStar } from "react-icons/fa";
import { Socials } from "../tabs/team/Socials";
import { useEffect, useState } from "react";
import { findTeam } from "@/utils/team";
import Link from "next/link";
import { Social } from "../Social";
import { CURR_YEAR } from "@/lib/constants";
import { favouriteTeam, unfavouriteTeam } from "@/utils/favourites";
import { useSession } from "next-auth/react";
import { districtCodeToName } from "@/lib/lists/districts";
import { AddSocialsModal } from "../modals/AddSocialsModal";
import { Socials as socials } from "@/lib/lists/socials";
import { ErrorMessage } from "../ErrorMessage";
import { LocationModal } from "../modals/LocationModal";
import { findColor } from "@/utils/findColor";

export function searchDistrict(array: any, valuetofind: any) {
  for (let i: number = 0; i < array.length; i++) {
    if (array[i].code === valuetofind) {
      return array[i].name;
    }
  }
}

export const TeamScreen = (props: any) => {
  const [error, setError] = useState(false);
  const isHOF = findTeam(String(props.team?.team_number));
  const [isStarFilled, setIsStarFilled] = useState(false);
  const { data: session } = useSession();
  const [isAddSocialModalOpen, setIsAddSocialModelOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [teamColor, setTeamColor] = useState("");

  const isFavourited = props.favouritedTeams?.some(
    (favouritedTeam: any): boolean =>
      favouritedTeam.team_number === props.team?.team_number
  );
  const favouritedTeam = props.favouritedTeams?.filter(
    (favouritedTeam: any): boolean =>
      favouritedTeam.team_number === props.team?.team_number
  );

  const avatarURL = props.avatar
    ? `data:image/jpeg;base64,${props.avatar}`
    : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
        props.team?.website?.startsWith("https")
          ? props.team?.website
          : `https://${props.team?.website?.slice(7)}`
      }/&size=64`;

  useEffect(() => {
    const fetchTeamColor = async () => {
      const teamColor = await findColor(avatarURL);
      setTeamColor(teamColor);
    };

    fetchTeamColor();
  }, [avatarURL]);

  return (
    <>
      <div className="md:pl-8 md:pr-8 w-full max-w-screen-3xl">
        <div className="bg-white border border-solid dark:border-[#2a2a2a] dark:bg-[#191919] rounded-lg px-10 py-10 flex flex-col mt-10">
          <div className="md:flex">
            {!error ? (
              <Image
                className="rounded-lg mr-5 w-20 mb-5 md:mb-0"
                alt={`Team ${props.team?.team_number} Avatar`}
                height="50"
                width="50"
                priority={true}
                src={avatarURL}
                onError={(): void => {
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
              <p
                onClick={() => setIsLocationModalOpen(true)}
                className="text-lightGray text-sm font-medium hover:text-primary cursor-pointer"
              >
                {props.team?.school_name && props.team?.school_name}{" "}
              </p>

              <h1 className="font-black text-black dark:text-white text-4xl">
                Team {props.team?.team_number}:{" "}
                <span style={{ color: teamColor }}>{props.team?.nickname}</span>
              </h1>

              <p className="text-lightGray">
                <b>
                  {props.team?.city && `${props.team?.city},`}{" "}
                  {props.team?.state_prov && `${props.team?.state_prov},`}{" "}
                  {props.team?.country}
                  {!props.team?.city &&
                    !props.team?.state_prov &&
                    !props.team?.country &&
                    "Unknown Location"}
                </b>{" "}
                • Joined <span>{props.team?.rookie_year}</span> •{" "}
                <a
                  href={`https://frc-events.firstinspires.org/team/${props.team?.team_number}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  FIRST Inspires
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-5 mt-3">
            {props.team?.website && (
              <a
                href={props.team?.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Social
                  icon={FaLink}
                  name={
                    props.team?.website.includes("https")
                      ? props.team?.website.replace("https://www.", "")
                      : props.team?.website.replace("http://www.", "")
                  }
                  className="text-black dark:text-white font-bold"
                />
              </a>
            )}
            {props.socials && <Socials socials={props.socials} />}
          </div>

          {!props.years?.includes(CURR_YEAR) && (
            <ErrorMessage
              message={
                <span className="flex">
                  <FaInfoCircle className="mr-2 text-xl mt-[2px]" /> Team{" "}
                  {props.team?.team_number}{" "}
                  {props.years.length > 0
                    ? `was last seen competing in ${props.years?.[0]}`
                    : "has never competed before"}
                </span>
              }
            />
          )}

          <div className="bg-white border border-solid dark:bg-card dark:border-[#2A2A2A] rounded-lg py-4 px-6 mt-5">
            {isHOF && (
              <Link href="/fame" legacyBehavior>
                <a>
                  <span className="text-[#ecc729] hover:text-black dark:text-white inline-block">
                    {" "}
                    <span className="flex mb-3 font-black">
                      <FaAward className="text-2xl mr-1" />{" "}
                      <span>Hall of Fame ({isHOF.year})</span>
                    </span>
                  </span>
                </a>
              </Link>
            )}

            <p className="text-black dark:text-white text-sm">
              <span className="font-bold"> District: </span>
              {props.team?.district && (
                <a
                  href={`https://frc-events.firstinspires.org/${CURR_YEAR}/district/${props.team?.district.toUpperCase()}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {searchDistrict(
                    districtCodeToName,
                    props.team.district.toUpperCase()
                  )}{" "}
                </a>
              )}
              <span className="text-lightGray">
                {props.team?.district
                  ? `(${props.team?.district.toUpperCase()}) `
                  : "N/A"}
              </span>
            </p>

            <p className="text-lightGray font-bold text-sm italic">
              {props.team?.name}
            </p>

            {session && (
              <div className="flex mt-3">
                <div className="flex gap-3">
                  {props.socials?.length !== socials.length && (
                    <button
                      onClick={() => setIsAddSocialModelOpen(true)}
                      className="text-sm text-lightGray hover:text-white  inline-flex items-center border border-gray-300 bg-[#f0f0f0] dark:bg-card dark:border-[#2A2A2A] rounded-lg px-3 py-1"
                    >
                      <FaPlus className="mr-2" />
                      <span>Add Social</span>
                    </button>
                  )}

                  <button
                    className="group text-primary text-sm  inline-flex items-center border border-gray-300 bg-[#f0f0f0] dark:bg-card dark:border-[#2A2A2A] rounded-lg px-3 py-1"
                    onClick={(): void => {
                      if (isFavourited) {
                        unfavouriteTeam(favouritedTeam, true);
                        setIsStarFilled(false);
                      } else {
                        setIsStarFilled(true);
                        favouriteTeam(props.team);
                      }
                    }}
                  >
                    <FaStar
                      className={`mr-2 ${
                        isFavourited || isStarFilled
                          ? "fill-primary group-hover:fill-transparent group-hover:stroke-primary group-hover:stroke-[40px] transition duration-300 group-hover:transform group-hover:scale-[1.2]"
                          : "fill-transparent stroke-primary stroke-[40px] group-hover:fill-primary transition duration-300 group-hover:transform group-hover:scale-[1.2]"
                      }`}
                    />
                    <span>
                      {isStarFilled || isFavourited
                        ? "Unfavourite"
                        : "Favourite"}{" "}
                      {props.team?.team_number}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddSocialsModal
        isOpen={isAddSocialModalOpen}
        setOpen={setIsAddSocialModelOpen}
        team={props.team}
        avatar={props.avatar}
        socials={props?.socials}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        setOpen={setIsLocationModalOpen}
        team={props.team}
      />
    </>
  );
};
