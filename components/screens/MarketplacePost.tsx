export const MarketplacePost = (props: any) => {
  return (
    <div className="container py-20 mx-auto">
      <div className="lg:w-11/12 mx-auto flex flex-wrap">
        <img
          className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
          src={props.marketplacePost.media[0]}
        />
        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
          <h2 className="text-sm text-gray-300">MISSISSAUGA, ON</h2>
          <h1
            className="text-white text-3xl font-bold mb-2"
            style={{ cursor: "auto" }}
          >
            {props.marketplacePost.title}
          </h1>
          <div className="flex mb-4">
            <span className="bg-yellow-50 px-2 py-1 text-[#d39c03] tracking-wider lowercase rounded-md text-xs">
              {props.marketplacePost.type}
            </span>
          </div>
          <p className="text-lightGray break-words">
            {props.marketplacePost.content}
          </p>

          <div className="flex mt-6 items-center pb-5 border-b-2 border-lightGray mb-5"></div>
          <span className="font-medium text-sm">
            <p className="text-xl text-gray-100">
              {props.marketplacePost.price}
            </p>
          </span>

          <div className="flex justify-between pt-5">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full object-cover object-center"
                src={props.marketplacePost.author.image}
              />
              <div className="mx-4">
                <h1 className="text-sm font-semibold text-gray-100">
                  {props.marketplacePost.author.name}
                </h1>
                <p className="text-sm text-lightGray">
                  {props.marketplacePost.author.email}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button className="text-sm ml-auto flex border border-[#2A2A2A] bg-card hover:border-gray-600 py-1 px-4 text-lightGray font-medium rounded-lg">
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
