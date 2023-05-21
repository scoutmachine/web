export const Card = (props: any) => {
  return (
    <div
      className={`${props.className} flex mt-5 ${
        props.withHeight && "h-[33vh]"
      } flex-col rounded-lg py-10 px-8 bg-white border border-solid dark:border-[#2A2A2A] dark:bg-[#191919] max-w-screen-3xl`}
    >
      {props.children}
    </div>
  );
};
