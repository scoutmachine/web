import { AnimatePresence, motion } from "framer-motion";
import { MarketplacePost } from "./marketplace/MarketplacePost";

export const MarketplaceScreen = (props: any) => {
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-left mt-10">
            <div className="pr-4 pl-4 md:pl-8 md:pr-8 flex items-center justify-center flex-col grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {props.marketplacePosts.map(
                (marketplacePost: any, key: number) => {
                  return (
                    <MarketplacePost
                      key={key}
                      marketplacePost={marketplacePost}
                    />
                  );
                }
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
