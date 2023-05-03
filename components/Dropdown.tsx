export const Dropdown = (props: any) => {
  return (
    <div className={`relative inline-block dropdown`}>
      {props.item}
      <div
        className={`${
          props.state ? "block" : "hidden"
        } absolute top-full px-6 right-0 mt-3 border dark:border-[#2A2A2A] dark:bg-card rounded-lg z-10`}
      >
        {props.children}
      </div>
    </div>
  );
};
