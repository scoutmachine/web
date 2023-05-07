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
        className="flex items-center justify-between cursor-pointer text-lightGray hover:text-white transition-all duration-150"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-medium">{props.question}</h3>
        <FaArrowUp
          className={`text-md transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      {open && <p className="mt-4 text-lightGray">{props.answer}</p>}
    </div>
  );
};
