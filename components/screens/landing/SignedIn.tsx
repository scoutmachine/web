import { Session } from "next-auth";
import { TeamCard } from "../../TeamCard";
import { FaStar, FaTags } from "react-icons/fa";
import { MarketplacePost } from "../marketplace/MarketplacePost";
import { useEffect, useState } from "react";
import { formatEpochSecondsToDate } from "@/utils/time";

export const SignedInScreen = (props: {
  session: Session;
  favourites: any;
  posts: any;
  avatars: any;
  user: any;
}) => {
  const [timeLeft, setTimeLeft] = useState<any>({});
  const kickoffTime = 1704542400;

  function calculateTimeLeft(distance: any) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return { weeks, days: remainingDays, hours, minutes, seconds };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = kickoffTime * 1000 - now;
      setTimeLeft(calculateTimeLeft(distance));
    }, 1000);
    return () => clearInterval(interval);
  }, [kickoffTime]);

  return (
    <>
      <div className="pl-4 pr-4 md:pr-8 md:pl-8 max-w-screen-3xl w-full">
        <div className="border border-[#2a2a2a] bg-[#191919] mt-10 rounded-lg px-10 py-10">
          <h1 className="flex flex-wrap font-bold text-5xl">
            Welcome back,{" "}
            <span className="text-primary md:ml-2">
              {props.session.user?.name}!
            </span>
          </h1>
          <p className="text-lightGray font-medium">
            {props.session.user?.email}
          </p>

          <div className="bg-card border border-[#2A2A2A] rounded-lg py-4 px-6 mt-5">
            <p className="text-lightGray">
              <b className="text-white">
                Ready for Kickoff on {formatEpochSecondsToDate(kickoffTime)}?
              </b>
              <br />
              {timeLeft.weeks} weeks, {timeLeft.days} days, {timeLeft.hours}{" "}
              hours, {timeLeft.minutes} mins, & {timeLeft.seconds} secs
            </p>
          </div>
        </div>

        <div className="border border-[#2a2a2a] bg-[#191919] mt-5 rounded-lg px-10 py-10">
          <p className="flex text-lightGray font-bold text-md">
            <FaStar className="text-[22px] mr-2 text-primary" /> FAVOURITED
            <span className="border border-[#2A2A2A] text-lightGray text-md px-2 mt-[-1px] ml-1 rounded-full font-semibold">
              {props.favourites.length}{" "}
              {props.favourites.length === 1 ? "team" : "teams"}
            </span>
          </p>
          {props.favourites.length > 0 ? (
            <div className="mt-3 sm:grid sm:grid-cols-2 md:grid md:grid-cols-4 flex flex-col gap-3">
              {props.favourites.map((team: any, key: number) => {
                return (
                  <TeamCard
                    key={key}
                    team={team}
                    avatars={props.avatars}
                    showFavLoading
                  />
                );
              })}
            </div>
          ) : (
            <span className="text-lightGray text-sm font-medium">
              Looks like you have not favourited any teams, yet.
            </span>
          )}

          <p className="flex text-lightGray font-bold text-md mt-8 md:mt-16">
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
            <span className="text-lightGray text-sm font-medium">
              Looks like you have no activity on marketplace, yet.
            </span>
          )}
        </div>
      </div>
    </>
  );
};
