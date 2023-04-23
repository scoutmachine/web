import Image from "next/image";

export const Footer = () => {
  return (
    <div className="px-4 py-2 pb-12 mt-10 rounded-lg flex flex-col md:items-center md:justify-center md:text-center pl-10 md:pl-0">
      <div className="text-gray-300 text-sm uppercase mb-3">
        Copyright © {new Date().getFullYear()} ⎯{" "}
        <a href="https://frc6070.ca" target="_blank">
          <span className="text-primary font-bold">
            Team 6070 Gryphon Machine
          </span>
        </a>
      </div>
    </div>
  );
};
