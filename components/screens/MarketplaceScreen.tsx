import { ListingType } from "@/types/ListingType";
import { useEffect, useMemo, useState } from "react";
import { MarketplacePost } from "./marketplace/MarketplacePost";

export const MarketplaceScreen = ({ marketplacePosts, user }: any) => {
  const [mounted, setMounted] = useState(false);
  const [listingType, setListingType] = useState("filterBy");

  const getFilteredMarketplacePosts = () => {
    if (listingType == "filterBy") {
      return marketplacePosts;
    }

    return marketplacePosts.filter((item: any) => item.type == listingType);
  };

  let filteredMarketplacePosts = useMemo(getFilteredMarketplacePosts, [
    listingType,
    marketplacePosts,
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="text-left mt-10">
      <div className="pl-4 pr-4 pb-4 md:pr-8 md:pl-8 max-w-screen-3xl w-full flex justify-between">
        <select
          onChange={(event) => setListingType(event.target.value)}
          className="border border-[#2A2A2A] bg-card outline-none rounded-lg text-lightGray px-3 py-[6px] text-sm"
        >
          <option key="filterBy" value="filterBy">
            filter by
          </option>
          {Object.values(ListingType).map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
        <p>
          {filteredMarketplacePosts.length}{" "}
          {filteredMarketplacePosts.length == 1 ? "post" : "posts"}
        </p>
      </div>
      {mounted && (
        <div className="pr-4 pl-4 md:pl-8 md:pr-8 flex items-center justify-center flex-col grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {filteredMarketplacePosts.map((marketplacePost: any, index: any) => (
            <MarketplacePost
              key={index}
              marketplacePost={marketplacePost}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};
