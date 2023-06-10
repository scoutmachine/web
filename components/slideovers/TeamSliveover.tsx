import { Dispatch, SetStateAction } from "react";
import { Icon } from "lucide-react";
import {
  FaArrowRight,
  FaLink,
  FaMapMarkerAlt,
  FaRobot,
  FaSchool,
} from "react-icons/fa";
import { Slideover } from "./Sliderover";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openTeam: any;
};

const Info = (props: {
  icon: Icon;
  title: string;
  desc: string;
  link?: any;
}) => {
  return (
    <div>
      <h1 className="text-md text-white flex font-semibold">
        <props.icon className="mr-2 mt-1" /> {props.title}
      </h1>

      {props.link ? (
        <a href={props.link} rel="noopener noreferrer" target="_blank">
          <p className="text-lightGray hover:text-white break-words">
            {props.desc}
          </p>
        </a>
      ) : (
        <p className="text-lightGray break-words">{props.desc}</p>
      )}
    </div>
  );
};

export const TeamSlideover = ({ isOpen, setOpen, openTeam }: Props) => {
  return (
    <Slideover isOpen={isOpen} setOpen={setOpen}>
      <div className="pl-8 pr-8">
        <h1 className="text-white font-bold text-3xl">
          Team {openTeam?.team_number}
        </h1>
        <p className="text-lightGray text-wxl">{openTeam?.nickname}</p>

        <div className="flex flex-col gap-5 mt-5">
          <Info
            icon={FaSchool}
            title="School Name"
            desc={openTeam?.school_name ? openTeam?.school_name : "No School"}
          />
          <Info
            icon={FaMapMarkerAlt}
            title="Location"
            desc={`${openTeam?.city}, ${openTeam?.state_prov}, ${openTeam?.country}`}
          />
          <Info
            icon={FaRobot}
            title="Rookie Year"
            desc={openTeam?.rookie_year}
          />
          <Info
            icon={FaLink}
            title="Website URL"
            desc={openTeam?.website ? openTeam?.website : "No Website"}
            link={openTeam?.website}
          />

          <Link
            href={`/team/${openTeam?.team_number}`}
            className="flex bg-card border border-[#2A2A2A] hover:border-gray-600 rounded-lg py-2 px-5 w-full text-primary hover:text-white font-bold transition-all duration-150"
          >
            View {openTeam?.team_number} Full Profile{" "}
            <FaArrowRight className="ml-2 mt-1" />
          </Link>
        </div>
      </div>
    </Slideover>
  );
};
