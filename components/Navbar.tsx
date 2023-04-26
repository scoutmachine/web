import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsPeopleFill, BsFillCalendarEventFill } from "react-icons/bs";
import { FaMedal } from "react-icons/fa";
import { SiRobotframework } from "react-icons/si";

const links = [
  { title: "Teams", href: "/teams", icon: <BsPeopleFill /> },
  { title: "Events", href: "/events", icon: <BsFillCalendarEventFill /> },
  { title: "Hall of Fame", href: "/fame", icon: <FaMedal /> },
  { title: "Rookie Teams", href: "/rookies", icon: <SiRobotframework /> },
];

export const Navbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const numLinksPerColumn = Math.ceil(links.length / 2);

  return (
    <>
      <div className="pl-8 pr-8">
        <div className="mt-5 bg-gray-800 border-2 border-gray-500 rounded-lg py-5 px-10 mb-[-10px] h-full max-w-screen-3xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex relative">
            <Link href="/" legacyBehavior>
              <a>
                <h1 className="font-black text-primary text-2xl">
                  sm<span className="text-white">.</span>
                </h1>
              </a>
            </Link>

            <div
              className={`absolute right-0 md:hidden block ${
                showLinks ? `bg-gray-600` : "bg-gray-700"
              } rounded-lg py-2 px-[13px] w-11`}
            >
              <AiOutlineMenu
                className="md:hidden text-white text-xl"
                onClick={() => setShowLinks(!showLinks)}
              />
            </div>
          </div>

          <div
            className={`md:flex md:items-center md:gap-6 ${
              showLinks ? "mt-5 grid grid-cols-2" : "hidden"
            }`}
          >
            {links.slice(0, numLinksPerColumn).map((link, key) => {
              return (
                <Link href={link.href} key={key} legacyBehavior>
                  <a className="block md:inline-block text-[0.9rem] text-white hover:text-primary mb-2 md:mb-0">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{link.icon}</span>
                      <span>{link.title}</span>
                    </div>
                  </a>
                </Link>
              );
            })}
            {links.slice(numLinksPerColumn).map((link, key) => {
              return (
                <Link href={link.href} key={key} legacyBehavior>
                  <a className="block md:inline-block text-[0.9rem] text-white hover:text-primary mb-2 md:mb-0">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{link.icon}</span>
                      <span>{link.title}</span>
                    </div>
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