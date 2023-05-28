/* eslint-disable @next/next/no-img-element */
import { API_URL } from "@/lib/constants";
import Link from "next/link";
import router from "next/router";
import { FaTrash } from "react-icons/fa";
import { useDistance } from "@/hooks/useDistance";

export const MarketplacePost = (props: any) => {
  const distance: number | null = useDistance(
    props.marketplacePost.latitude,
    props.marketplacePost.longitude
  );
  const showTrashIcon =
    props.user?.admin || props.marketplacePost.author.id === props.user?.id;
  const deletePost = async (): Promise<void> => {
    await fetch(`${API_URL}/api/@me/post?id=${props.marketplacePost.id}`, {
      method: "DELETE",
    });

    router.reload();
  };

  return (
    <div>
      <div className="overflow-hidden relative border border-[#2A2A2A] bg-card hover:border-gray-600 px-5 py-5 rounded-lg">
        {Number.isNaN(distance) || distance === 0 ? (
          ""
        ) : (
          <span className="text-sm text-lightGray bottom-3 left-5 md:text-left">
            📌 {Math.ceil(distance as number).toLocaleString("en-US")} km away
          </span>
        )}
        <Link href={`/marketplace/${props.marketplacePost.id}`}>
          {props.marketplacePost.media.length > 0 && (
            <img
              className="rounded-lg mb-4 object-contain md:h-[350px] md:w-[350px]"
              src={props.marketplacePost.media[0]}
              alt={`${props.marketplacePost.title} Media Image`}
            />
          )}
          <h1 className="font-bold text-xl text-black dark:text-white">
            {props.marketplacePost.title}
          </h1>
          <p className="text-lightGray break-words mb-3">
            {props.marketplacePost.content}
          </p>
        </Link>

        <div className="flex items-center pt-3">
          <img
            className="h-10 w-10 rounded-full object-cover object-center"
            src={props.marketplacePost.author?.image}
            alt={`${props.marketplacePost.author.image} Avatar`}
          />
          <div className="mx-4">
            <h1 className="text-sm font-semibold text-black dark:text-white">
              {props.marketplacePost.author?.name.length > 24
                ? `${props.marketplacePost.author?.name.slice(0, 24)}...`
                : props.marketplacePost.author?.name}
            </h1>
            {props.marketplacePost.author?.teamNumber ? (
              <Link
                href={`/team/${props.marketplacePost.author.teamNumber}`}
                legacyBehavior
              >
                <a className="text-sm text-lightGray">
                  Team {props.marketplacePost.author.teamNumber}
                </a>
              </Link>
            ) : (
              <p className="text-sm text-lightGray">Unknown Team</p>
            )}
          </div>

          {showTrashIcon && (
            <FaTrash
              className="absolute bottom-7 right-6 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={() => deletePost()}
            />
          )}
        </div>
      </div>
    </div>
  );
};
