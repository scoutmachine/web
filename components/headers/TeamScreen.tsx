import Image from "next/image";
import { FaAward, FaLink } from "react-icons/fa";
import { Socials } from "../tabs/team/Socials";
import { useState } from "react";
import { findTeam } from "@/util/team";
import Link from "next/link";
import { Social } from "../Social";

export const TeamScreen = (props: any) => {
  const [error, setError] = useState(props.team.website ? false : true);
  const isHOF = findTeam(String(props.team.team_number));
  const currentDistrict = props.district
    ? props.district[props.district.length - 1]
    : null;

  return (
    <div className="bg-gray-800 rounded-lg py-10 px-10 md:w-[1100px] mt-16 relative">
      <div className="md:flex">
        {!error ? (
          <Image
            className="rounded-lg mr-5 w-20 mb-5 md:mb-0"
            alt={`${props.team.team_number} Logo`}
            height="50"
            width="50"
            priority={true}
            src={
              props.avatar
                ? `data:image/jpeg;base64,${props.avatar}`
                : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
                    props.team.website.startsWith("https")
                      ? props.team.website
                      : `https://${props.team.website.slice(7)}`
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
          <p className="text-gray-400 text-sm font-medium">
            {props.team.school_name && props.team.school_name}{" "}
          </p>

          <h1 className="font-black text-4xl">
            FRC {props.team.team_number}:{" "}
            <span className="text-primary">{props.team.nickname}</span>
          </h1>

          <p className="text-gray-400">
            <b>
              {props.team.city}, {props.team.state_prov}, {props.team.country}
            </b>{" "}
            • Joined <span>{props.team.rookie_year}</span> •{" "}
            <a
              href={`https://frc-events.firstinspires.org/team/${props.team.team_number}`}
              target="_blank"
            >
              <span className="text-white hover:text-primary">
                FIRST Inspires
              </span>
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
      </div>

      <div className="bg-gray-700 border-2 border-gray-500 rounded-lg py-4 px-6 mt-5">
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
              href={`https://frc-events.firstinspires.org/2023/district/${currentDistrict.abbreviation}`}
              target="_blank"
              className="hover:text-primary"
            >
              {currentDistrict.display_name}{" "}
            </a>
          )}
          <span className="text-gray-400">
            {currentDistrict
              ? `(${currentDistrict.abbreviation.toUpperCase()}) `
              : "N/A"}
          </span>
        </p>

        <p className="text-gray-400 font-bold text-sm italic">
          {" "}
          {props.team.name}
        </p>
      </div>
    </div>
  );
};
