import { WrappedContainer } from "../WrappedContainer";

export const IntroSlide = (props: any) => {
  return (
    <WrappedContainer>
      <h1 className="text-lightGray font-bold text-lightGray text-5xl mb-[-15px]">
        Did someone say <span className="text-white">{props.team} Wrap?</span>
      </h1>
      <p className="text-lightGray">
        Get ready to see season highlights, match videos, & so much more!
      </p>

      <button
        className="bg-card border border-[#2A2A2A] px-16 py-2 rounded-lg hover:text-white transition-all duration-150"
        onClick={() => props.setPage("ready")}
      >
        View Wrapped
      </button>
    </WrappedContainer>
  );
};
