import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GITHUB_URL } from "@/lib/constants";
import { FaInfoCircle } from "react-icons/fa";

export const Footer = () => {
  const [latestCommit, setLatestCommit] = useState<string | undefined>();
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 3;

  const fetchLatestCommit = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/scoutmachine/web/commits`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch latest commit");
      }

      const data = await response.json();
      setLatestCommit(data[0].sha);
    } catch (error) {
      console.error(error);

      // Retry logic
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        setTimeout(fetchLatestCommit, 2000);
      }
    }
  };

  useEffect(() => {
    fetchLatestCommit();
  });

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
        <p className="text-xs flex justify-center items-center mb-3">
          <FaInfoCircle className="mr-1 mt-[2px]" /> All Data provided via FIRST
          & TBA API
        </p>
        <Link href="/privacy">
          <p className="uppercase text-primary text-xs font-bold hover:text-white">
            Privacy Policy
          </p>
        </Link>
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
