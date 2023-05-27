import { favouriteTeam, unfavouriteTeam } from "@/utils/favourites";
import Link from "next/link";
import router from "next/router";
import { ChangeEvent, useState } from "react";
import { FaSearch, FaStar } from "react-icons/fa";

export const Search = (props: any) => {
  const [isStarFilled, setIsStarFilled] = useState(false);

  return (
    <div className="relative md:mr-8 2xl:mr-0 mt-3 md:mt-0">
      <input
        className="bg-white border border-solid hover:border-gray-600 w-full dark:border-[#2A2A2A] dark:hover:border-gray-600 dark:bg-card placeholder-lightGray outline-none rounded-lg text-lightGray px-3 py-[6px] text-sm pl-8"
        type="text"
        placeholder="Search teams..."
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          props.setSearchTerm(e.target.value.trim())
        }
        spellCheck={false}
      />
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <FaSearch className="text-sm text-lightGray" />
      </span>

      <div
        className={`absolute top-10 w-full overflow-x-hidden ${
          props.teams && props.filteredOptions.length > 4 && "overflow-y-auto"
        } ${props.searchTerm && props.filteredOptions.length > 4 && "h-64"} ${
          props.searchTerm && "z-50 border border-[#2A2A2A]"
        } rounded-lg`}
      >
        {props.teams &&
          props.filteredOptions.length > 0 &&
          props.filteredOptions.map((team: any, key: number) => {
            const isFavourited = props.favourites?.some(
              (favouritedTeam: any): boolean =>
                favouritedTeam.team_number === team.team_number
            );
            const favouritedTeam = props.favourites?.filter(
              (favouritedTeam: any): boolean =>
                favouritedTeam.team_number === team.team_number
            );

            return (
              <div
                key={key}
                className={`bg-card text-lightGray py-1 px-3 cursor-pointer ${
                  props.searchTerm.length === 0 && "hidden"
                }`}
                onClick={() =>
                  props.setSearchTerm(`${team.nickname} - ${team.team_number}`)
                }
              >
                <a
                  key={key}
                  href={`/teams/${team.team_number}`}
                  onClick={() => props.setSearchTerm("")}
                >
                  <span className="font-medium">{team.team_number} |</span>{" "}
                  {team.nickname}{" "}
                </a>

                {props.session && (
                  <FaStar
                    onClick={(): void => {
                      if (isFavourited) {
                        unfavouriteTeam(favouritedTeam);
                      } else {
                        setIsStarFilled(!isStarFilled);
                        favouriteTeam(team);
                        props.refresh && router.push(router.pathname);
                      }
                    }}
                    className={`inline-block mb-1 ml-1 ${
                      isFavourited || isStarFilled
                        ? "fill-primary hover:fill-transparent hover:stroke-primary hover:stroke-[40px]"
                        : "fill-transparent stroke-primary stroke-[40px] hover:fill-primary"
                    }`}
                  />
                )}
              </div>
            );
          })}

        {props.teams && props.filteredOptions.length === 0 && (
          <div className="bg-card">
            <p className="text-lightGray px-2 py-2 text-sm">
              No results found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
