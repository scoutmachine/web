import { Session } from "next-auth";
import { TeamCard } from "../../TeamCard";
import { FaStar, FaTags } from "react-icons/fa";
import { MarketplacePost } from "../marketplace/MarketplacePost";

export const SignedInScreen = (props: {
  session: Session;
  favourites: any;
  posts: any;
  avatars: any;
}) => {
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
