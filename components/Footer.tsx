import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GITHUB_URL } from "@/lib/constants";

export const Footer = () => {
  const [latestCommit, setLatestCommit] = useState<string>();

  useEffect(() => {
    const fetchLatestCommit = async () => {
      const data = await fetch(
        `https://api.github.com/repos/scoutmachine/web/commits`
      ).then((res) => res.json());
      setLatestCommit(data[0].sha);
    };

    fetchLatestCommit();
  });

  return (
    <div className="px-4 py-2 pb-12 mt-10 rounded-lg flex flex-col items-center justify-center text-center">
      <div className="text-lightGray text-sm uppercase mb-3">
        Copyright © {new Date().getFullYear()} ⎯{" "}
        <Link href="/" legacyBehavior>
          <a>
            <span className="text-primary font-bold">
              Scout Machine
            </span>
          </a>
        </Link>
        <br/>
        <a
          href={`${GITHUB_URL}/commit/${latestCommit}`}
          className="text-xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Commit # {latestCommit}
        </a>
        <div className="flex items-center justify-center">
          <a
            href="https://vercel.com/?utm_source=scoutmachine&utm_campaign=oss"
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
