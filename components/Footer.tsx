import Link from "next/link";
import Image from "next/image";

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
        <div className="flex items-center justify-center">
          <a
            href="https://vercel.com/?utm_source=gryphonmachine&utm_campaign=oss"
            target="_blank"
          >
            <Image
              src="/powered-by-vercel.svg"
              height="150"
              width="150"
              alt="Powered by Vercel"
              className="mt-2"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
