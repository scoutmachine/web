export const Feature = (props: any) => {
  return (
    <div className="rounded-full bg-card hover:border-gray-600 select-none cursor-auto text-sm text-lightGray hover:text-white transition-all duration-150 py-2 px-4 border border-[#2A2A2A] text-center flex items-center justify-center">
      {props.name}
    </div>
  );
};
