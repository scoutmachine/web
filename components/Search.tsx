import { FaSearch } from "react-icons/fa";

export const Search = (props: any) => {
  return (
    <div className="relative">
      <input
        type="text"
        spellCheck="false"
        className="border border-[#2A2A2A] bg-card placeholder-lightGray outline-none rounded-lg text-lightGray px-3 py-2 text-sm pl-8 mt-5 md:w-[500px]"
        {...props}
      />
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-5">
        <FaSearch className="text-sm text-lightGray" />
      </span>
    </div>
  );
};
