import { Session } from "next-auth";
import { TeamCard } from "../../TeamCard";
import { FaStar, FaTags } from "react-icons/fa";
import { MarketplacePost } from "../marketplace/MarketplacePost";
import { useEffect, useState } from "react";
import { formatEpochSecondsToDate } from "@/utils/time";
import { NextRouter, useRouter } from "next/router";
import Link from "next/link";
import { HiStatusOnline } from "react-icons/hi";
import { TeamCompetingCard } from "@/components/TeamCompetingCard";

export const SignedInScreen = (props: {
  session: Session;
  favourites: any;
  posts: any;
  avatars: any;
  user: any;
  competing: any;
}) => {
  const [timeLeft, setTimeLeft] = useState<any>({});
  const kickoffTime: number = 1704542400;
  const router: NextRouter = useRouter();
  const currentTime = new Date();

  function calculateTimeLeft(distance: any): {
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const days: number = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes: number = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds: number = Math.floor((distance % (1000 * 60)) / 1000);
    const weeks: number = Math.floor(days / 7);
    const remainingDays: number = days % 7;
    return { weeks, days: remainingDays, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval: NodeJS.Timer = setInterval((): void => {
      const now: number = new Date().getTime();
      const distance: number = kickoffTime * 1000 - now;
      setTimeLeft(calculateTimeLeft(distance));
    }, 1000);
    return () => clearInterval(interval);
  }, [kickoffTime]);

  const filteredTeams = Object.entries(props.competing).reduce(
    (teams: any, [teamKey, teamData]: any) => {
      const startTime = new Date(teamData.match.startTime);
      if (startTime > currentTime) {
        teams[teamKey] = teamData;
      }
      return teams;
    },
    {}
  );

  return (
    <>
      <div className="w-full pl-4 pr-4 md:pr-8 md:pl-8 max-w-screen-3xl">
        <div className="border border-[#2a2a2a] bg-[#191919] mt-10 rounded-lg px-10 py-10">
          <h1 className="flex flex-wrap text-5xl font-bold text-black dark:text-white">
            Welcome back,{" "}
            <span className="text-primary md:ml-2">
              {props.session.user?.name}!
            </span>
          </h1>
          <p className="font-medium text-lightGray">
            {/* @ts-ignore */}
            <Link href={`/users/${props.session.user?.username}`}>
              @{(props.session.user as any)?.username}
            </Link>{" "}
            • {props.session.user?.email}
          </p>

          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-3">
            <div className="bg-card border border-[#2A2A2A] rounded-lg py-4 px-6 mt-5">
              <p className="text-lightGray">
                <b className="text-black dark:text-white">
                  Ready for Kickoff on {formatEpochSecondsToDate(kickoffTime)}?
                </b>
                <br />
                {timeLeft.weeks} weeks, {timeLeft.days} days, {timeLeft.hours}{" "}
                hours, {timeLeft.minutes} mins, & {timeLeft.seconds} secs
              </p>
            </div>
            <div className="bg-card border border-[#2A2A2A] rounded-lg py-4 px-6 mt-5">
              <p className="text-lightGray">
                <b className="text-black dark:text-white">Current Season</b>
                <br />
                2023 CHARGED UP
              </p>
            </div>
          </div>
        </div>

        <div className="border border-[#2a2a2a] bg-[#191919] mt-5 rounded-lg px-10 py-10">
          <p className="flex font-bold text-lightGray text-md">
            <HiStatusOnline className="text-[25px] mr-2 text-primary" />{" "}
            CURRENTLY COMPETING
            <span className="border border-[#2A2A2A] text-lightGray text-md px-2 mt-[-1px] ml-1 rounded-full font-semibold">
              {Object.keys(filteredTeams).length}{" "}
              {Object.keys(filteredTeams).length === 1 ? "team" : "teams"}
            </span>
          </p>

          {Object.values(filteredTeams).length > 0 ? (
            <div className="flex flex-col gap-3 mt-3 sm:grid sm:grid-cols-2 md:grid md:grid-cols-4">
              {Object.values(filteredTeams)
                .reverse()
                .map((team: any, key: number) => {
                  return (
                    <TeamCompetingCard
                      favourite={props.favourites[key]}
                      team={team}
                      key={key}
                      avatars={props.avatars}
                    />
                  );
                })}
            </div>
          ) : (
            <span className="text-sm font-medium text-lightGray">
              Looks like you none of your favourited teams are currently
              competing.
            </span>
          )}

          <p className="flex font-bold text-lightGray text-md mt-8 md:mt-16">
            <FaStar className="text-[22px] mr-2 text-primary" /> FAVOURITED
            <span className="border border-[#2A2A2A] text-lightGray text-md px-2 mt-[-1px] ml-1 rounded-full font-semibold">
              {props.favourites.length}{" "}
              {props.favourites.length === 1 ? "team" : "teams"}
            </span>
          </p>
          {props.favourites.length > 0 ? (
            <div className="flex flex-col gap-3 mt-3 sm:grid sm:grid-cols-2 md:grid md:grid-cols-4">
              {props.favourites.map((team: any, key: number) => {
                return (
                  <TeamCard
                    key={key}
                    team={team}
                    avatars={props.avatars}
                    favourites={props.favourites}
                    showFavLoading
                  />
                );
              })}
            </div>
          ) : (
            <span className="text-sm font-medium text-lightGray">
              Looks like you have not favourited any teams, yet.
            </span>
          )}

          <p
            onClick={() => router.push("/marketplace")}
            className="flex mt-8 font-bold text-lightGray text-md md:mt-16 hover:cursor-pointer"
          >
            <FaTags className="text-[22px] mr-2 text-lightGray" /> Marketplace
            <span className="border border-[#2A2A2A] text-lightGray text-md px-2 mt-[-1px] ml-1 rounded-full font-semibold">
              {props.posts.length} {props.posts.length === 1 ? "post" : "posts"}
            </span>
          </p>
          {props.posts.length > 0 ? (
            <div className="flex flex-wrap gap-3 mt-3">
              {props.posts.map((post: any) => {
                return (
                  <MarketplacePost
                    key={post.id}
                    marketplacePost={post}
                    user={props.user}
                  />
                );
              })}
            </div>
          ) : (
            <span className="text-sm font-medium text-lightGray">
              Looks like you have no activity on marketplace, yet.
            </span>
          )}
        </div>
      </div>
    </>
  );
};
