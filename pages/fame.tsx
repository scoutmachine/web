import { Footer } from "@/components/Footer";
import { HOFTeams } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { FaAward } from "react-icons/fa";
export default function HOF() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="md:w-[900px] flex flex-col justify-center items-center">
          <h1 className="flex text-3xl md:text-5xl mt-16 font-black text-primary mb-2">
            <FaAward className="mr-5" />{" "}
            <span className="italic mr-3">FIRST</span> Hall of Fame
          </h1>
          <p className="text-gray-400 text-center pr-6 pl-6">
            The Chairman&apos;s Award stands as the pinnacle of achievement
            within the <span className="italic">FIRST</span> community,
            recognizing individuals who embody the organization&apos;s mission
            and ideals to the fullest extent. Those who receive this coveted
            honor are bestowed with the privilege of being enshrined in the
            esteemed <span className="italic">FIRST</span> Hall of Fame.
          </p>
        </div>
        <div className="bg-gray-900 rounded-lg py-10 md:px-10 px-[26px] flex items-center justify-center grid md:grid-cols-6 grid-cols-2 mt-12 gap-x-5 md:w-[1000px] w-[350px]">
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
                    {team.name === "321" ? "Impact Award" : "Chairman's Award"}
                  </span>{" "}
                  <br /> <br />
                  <Link href={`/${team.name}`} legacyBehavior>
                    <a>
                      <span className="font-bold hover:text-primary">
                        Team {team.name}
                      </span>
                    </a>
                  </Link>
                </div>

                <div className="award-event">
                  <span className="text-xs">{team.year}</span>
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
