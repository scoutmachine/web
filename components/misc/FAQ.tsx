import { ReactNode, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export const FAQ = (props: {
  question: string;
  answer: string | ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <div className="border border-[#2A2A2A] rounded-md p-4 mb-4">
      <div
        className="group flex items-center justify-between cursor-pointer text-lightGray hover:text-black dark:hover:text-white dark:text-white"
        onClick={toggleOpen}
      >
        <h3 className={`${open && "text-white"} text-lightGray dark:hover:text-white text-lg font-medium transition-all duration-150`}>
          {props.question}
        </h3>
        <FaArrowUp
          className={`text-md transform transition-transform text-lightGray group-hover:text-black dark:group-hover:text-white transition-all duration-150 ${
            open && "rotate-180 text-white"
          }`}
        />
      </div>
      {open && <p className="mt-4 text-lightGray">{props.answer}</p>}
    </div>
  );
};
