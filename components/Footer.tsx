export const Footer = () => {
  return (
    <div className="px-4 py-2 pb-12 mt-10 rounded-lg flex flex-col items-center justify-center text-center">
      <div className="text-lightGray text-sm uppercase mb-3">
        Copyright © {new Date().getFullYear()} ⎯{" "}
        <a href="https://frc6070.ca" target="_blank">
          <span className="text-primary hover:text-white font-bold">
            Team 6070 Gryphon Machine
          </span>
        </a>
      </div>
    </div>
  );
};
