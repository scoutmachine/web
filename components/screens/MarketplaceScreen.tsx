import Link from 'next/link'

const MarketplacePost = (props: any) => {
  return (
    // <Link href={`/events/`} legacyBehavior>
      <div>
        <div
          className={`
          "md:w-[310px] w-[430px] border border-[#2A2A2A] bg-card hover:border-gray-600 px-5 py-5 h-1/2 rounded-lg relative`}>
          <h1 className="font-bold text-xl text-white">
            {props.marketplacePost.title}
          </h1>
          <img
              className=""
              src="https://picsum.photos/400/250"
              alt=""
            />
          <p className="text-lightGray break-words">
            {props.marketplacePost.content}
          </p>

          <p className="text-sm font-medium pt-5">Listed By</p>
          <div className="flex items-center pt-3">
            <img
              className="h-10 w-10 rounded-full object-cover object-center"
              src={props.marketplacePost.author.image}
              alt=""
            />
            <div className="mx-4">
              <h1 className="text-sm font-semibold text-white">
              {props.marketplacePost.author.name}
              </h1>
              <Link href={`/teams/6070`}>
                <p className="text-sm text-lightGray">
                  Team 6070
                </p>
              </Link>
            </div>
          </div>
        </div>
        </div>
    // </Link>
  );
};

export const MarketplaceScreen = (props: any) => {
  return (
    <>
      <div className="text-left">
      <h1 className="pl-8 text-lightGray mt-10 mb-5 text-2xl">
        <span className="font-bold text-white">Marketplace</span>
      </h1>
      <div className="pr-4 pl-4 md:pl-8 md:pr-8 flex items-center justify-center flex-col grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        {props.marketplacePosts.map((marketplacePost: any, key: number) => {
          return <MarketplacePost key={key} marketplacePost={marketplacePost} />;
        })}
      </div>
    </div>
    </>
  );
};
