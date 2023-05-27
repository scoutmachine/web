import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GITHUB_URL } from "@/lib/constants";

export const Footer = () => {
  const [latestCommit, setLatestCommit] = useState<string>();

  const fetchLatestCommit = async (): Promise<void> => {
    const data = await fetch(
      `https://api.github.com/repos/scoutmachine/web/commits`
    ).then((res: Response) => res.json());
    setLatestCommit(data[0].sha);
  };

  if (!latestCommit) {
    fetchLatestCommit();
  }

  return (
    <div className="px-4 py-2 pb-12 mt-10 rounded-lg flex flex-col items-center justify-center text-center">
      <div className="text-lightGray text-sm uppercase mb-3">
        Copyright © {new Date().getFullYear()} ⎯{" "}
        <Link href="/" legacyBehavior>
          <a>
            <span className="text-primary font-bold">Scout Machine</span>
          </a>
        </Link>
        <br />
        <a
          href="https://thebluealliance.com"
          target="_blank"
          className="text-xs"
          rel="noopener noreferrer"
        >
          All Match, Event, & Team Data is provided by TBA via their API.
        </a>
        <br />
        <a href="./privacy" className="text-xs">
          Privacy Policy
        </a>
        <br />
        {latestCommit && (
          <a
            href={`${GITHUB_URL}/commit/${latestCommit}`}
            className="text-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Commit # {latestCommit}
          </a>
        )}
        <div className="flex items-center justify-center">
          <a
            href="https://vercel.com/?utm_source=scoutmachine&utm_campaign=oss"
            target="_blank"
            rel="noopener noreferrer"
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
