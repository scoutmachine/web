import Link from "next/link";
import React from "react";

const links = [
  { title: "Teams", href: "/teams" },
  { title: "Events", href: "/events" },
  { title: "Hall of Fame", href: "/fame" },
];

export const Navbar = () => {
  return (
    <>
      <div className="w-full mt-5 bg-gray-800 border-2 border-gray-500 rounded-lg py-5 px-8 mb-[-10px] h-full max-w-[69rem] mx-auto flex flex-col">
        <div className="w-full flex items-center justify-between">
          <Link href="/" legacyBehavior>
            <a>
              <h1 className="font-black text-primary text-2xl">
                sm<span className="text-white">.</span>
              </h1>
            </a>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {links.map((link, key) => {
              return (
                <Link href={link.href} key={key} legacyBehavior>
                  <a className="text-[0/9rem] font-semibold hover:text-primary">
                    {link.title}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
