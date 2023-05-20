import { ListingType } from "@/types/ListingType";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { MarketplacePost } from "./marketplace/MarketplacePost";

export const MarketplaceScreen = ({ marketplacePosts, user }: any) => {
  const [mounted, setMounted] = useState(false);
  const [listingType, setListingType] = useState("filterBy");

  const getFilteredMarketplacePosts = (): any => {
    if (listingType == "filterBy") {
      return marketplacePosts;
    }

    return marketplacePosts.filter(
      (item: any): boolean => item.type == listingType
    );
  };

  let filteredMarketplacePosts = useMemo(getFilteredMarketplacePosts, [
    listingType,
    marketplacePosts,
  ]);

  useEffect((): void => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="text-left mt-10">
        <div className="pl-4 pr-4 pb-4 md:pr-8 md:pl-8 max-w-screen-3xl w-full flex">
          <p className="mr-2 text-lightGray">
            {filteredMarketplacePosts.length}{" "}
            {filteredMarketplacePosts.length === 1 ? "post" : "posts"}
          </p>
          <select
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setListingType(event.target.value)
            }
            className="border border-[#2A2A2A] bg-card outline-none rounded-lg text-lightGray px-3 py-[6px] text-sm"
          >
            <option key="filterBy" value="filterBy">
              filter by
            </option>
            {Object.values(ListingType).map((value: ListingType) => {
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="pl-4 pr-4 md:pl-8 md:pr-8 gap-3 space-y-3 columns-1 md:columns-3 lg:columns-5">
        {filteredMarketplacePosts.map((marketplacePost: any, index: any) => (
          <MarketplacePost
            key={index}
            marketplacePost={marketplacePost}
            user={user}
          />
        ))}
      </div>
    </>
  );
};
