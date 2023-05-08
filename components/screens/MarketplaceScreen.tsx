import { useEffect, useState } from "react";
import { MarketplacePost } from "./marketplace/MarketplacePost";

export const MarketplaceScreen = ({ marketplacePosts }: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="text-left mt-10">
      {mounted && (
        <div className="pr-4 pl-4 md:pl-8 md:pr-8 flex items-center justify-center flex-col grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {marketplacePosts.map((marketplacePost: any, index: any) => (
            <MarketplacePost key={index} marketplacePost={marketplacePost} />
          ))}
        </div>
      )}
    </div>
  );
};
