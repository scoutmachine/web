import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { HOFTeams } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { FaMedal } from "react-icons/fa";
export default function HOF() {
  return (
    <>
      <Navbar />

      <div className="flex flex-wrap items-center justify-center mt-16 pr-8 pl-8">
        <div className="bg-gray-800 md:w-[1100px] w-[350px] rounded-lg py-12 px-12">
          <a href="https://www.firsthalloffame.org/" target="_blank">
            <h1 className="md:flex text-3xl md:text-5xl font-black text-primary mb-2 hover:text-white">
              <FaMedal className="mr-3 md:ml-0 ml-[-10px] md:mb-0 mb-3 w-[50px]" />{" "}
              <span className="italic md:mr-3 mr-1">FIRST</span> Hall of Fame
            </h1>
          </a>
          <p className="text-gray-400">
            The Impact Award (previously Chairman&apos;s Award) stands as the
            pinnacle of achievement within the{" "}
            <span className="italic">FIRST</span> community, recognizing teams
            who embody the organization&apos;s mission and ideals to the fullest
            extent. Those who receive this coveted honor are bestowed with the
            privilege of being enshrined in the esteemed{" "}
            <span className="italic">FIRST</span> Hall of Fame.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg py-10 md:px-10 px-[26px] flex items-center justify-center grid md:grid-cols-7 grid-cols-2 mt-5 gap-x-5 md:w-[1100px] w-[350px]">
          {HOFTeams.map((team: any, key: number) => {
            return (
              <div className="banner" key={key}>
                <div className="flex items-center justify-center mt-3">
                  <Image
                    src="/first-icon.svg"
                    height="50"
                    width="50"
                    alt="FIRST Logo"
                  />
                </div>
                <div className="award-name mt-5">
                  <span className="italic font-black">
                    {team.year > "2022" ? "Impact Award" : "Chairman's Award"}
                  </span>{" "}
                  <br /> <br />
                  <Link href={`/teams/${team.name}`} legacyBehavior>
                    <a>
                      <span className="font-bold hover:text-[#ecc729]">
                        Team {team.name}
                      </span>
                    </a>
                  </Link>
                </div>

                <div className="award-event">
                  <span className="text-xs font-semibold">{team.year}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
