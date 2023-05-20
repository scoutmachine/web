/* eslint-disable @next/next/no-img-element */
import { useDistance } from "@/hooks/useDistance";
import { ListingType } from "@/types/ListingType";
import { FaMoneyBill } from "react-icons/fa";

export const MarketplacePage = (props: any) => {
  const distance: number | null = useDistance(
    props.marketplacePost.latitude,
    props.marketplacePost.longitude
  );
  const partTypeColour = (): string => {
    switch (props.marketplacePost.type) {
      case "controller":
        return "#1f87ff";
      case "sensor":
        return "#1f87ff";
      case "gear":
        return "	#454545";
      case "stock":
        return "#c2c2c2";
      default:
        return "#000";
    }
  };

  return (
    <div className="pl-4 pr-4 md:pl-8 md:pr-8 max-w-screen-3xl w-full py-20">
      <div className="flex flex-wrap">
        <img
          className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
          src={props.marketplacePost?.media[0]}
          alt=""
        />
        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
          <div className="pb-3">
            <h2 className="text-sm text-gray-300 uppercase">
              {props.marketplacePost.formattedAddress}
            </h2>
            <h2 className="text-sm text-gray-300">
              📌 {Math.ceil(distance as number).toLocaleString("en-US")} km away
            </h2>
          </div>
          <h1
            className="text-white text-3xl font-bold mb-2"
            style={{ cursor: "auto" }}
          >
            {props.marketplacePost.title}
          </h1>
          <div className="flex mb-4">
            <span
              style={{ backgroundColor: partTypeColour() }}
              className="px-2 py-1 text-white font-medium uppercase rounded-md text-xs"
            >
              {
                ListingType[
                  props.marketplacePost.type as keyof typeof ListingType
                ]
              }
            </span>
          </div>
          <p className="text-lightGray break-words">
            {props.marketplacePost.content}
          </p>

          <p className="flex bg-card border border-[#2a2a2a] rounded-lg py-2 px-4 text-xl text-lightGray mt-16">
            <FaMoneyBill className="mr-2 text-3xl" />
            {props.marketplacePost.price}{" "}
            {props.marketplacePost.currencyType != null
              ? props.marketplacePost.currencyType
              : "Invalid Currency Type"}
          </p>

          <div className="flex mt-6 items-center pb-5 border-b-2 border-[#2a2a2a] mb-5"></div>
          <div className="flex justify-between pt-5">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full object-cover object-center"
                src={props.marketplacePost.author?.image}
                alt=""
              />
              <div className="mx-4">
                <h1 className="text-sm font-semibold text-gray-100">
                  {props.marketplacePost.author?.name}
                </h1>
                <p className="text-sm text-lightGray">
                  {props.marketplacePost.author?.email}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <a
                href={`mailto:${props.marketplacePost.author?.email}`}
                rel="noopener noreferrer"
              >
                <button className="text-sm ml-auto flex border border-[#2A2A2A] bg-card hover:border-gray-600 py-1 px-4 text-lightGray font-medium rounded-lg">
                  Contact Seller
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
