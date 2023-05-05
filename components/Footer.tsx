import Link from "next/link";

export const Footer = () => {
  return (
    <div className="px-4 py-2 pb-12 mt-10 rounded-lg flex flex-col items-center justify-center text-center">
      <div className="text-lightGray text-sm uppercase mb-3">
        Copyright © {new Date().getFullYear()} ⎯{" "}
        <Link href="/" legacyBehavior>
          <a>
            <span className="text-primary hover:text-white font-bold">
              Scout Machine
            </span>
          </a>
        </Link>
      </div>
    </div>
  );
};
