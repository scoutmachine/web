export const Card = (props: any) => {
    return (
      <div
        className={`${props.className} flex mt-5 ${
          props.withHeight && "h-[33vh]"
        } flex-col rounded-lg py-10 px-8 border border-[#2A2A2A] bg-[#191919] max-w-screen-3xl`}
      >
        {props.children}
      </div>
    );
  };