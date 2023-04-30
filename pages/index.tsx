import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Head from "next/head";
import { FaCoffee, FaDiscord, FaGithub } from "react-icons/fa";

const Card = (props: any) => {
  return (
    <div
      className={`${props.className} mt-10 flex ${
        props.withHeight && "h-[33vh]"
      } flex-col rounded-lg border border-gray-300 py-10 px-8 dark:border-[#2A2A2A] dark:bg-[#191919] max-w-screen-3xl`}
    >
      {props.children}
    </div>
  );
};

const Feature = (props: any) => {
  return (
    <span className="rounded-full bg-card px-3 py-2 text-sm text-lightGray border dark:border-[#2A2A2A]">
      {props.name}
    </span>
  );
};

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Scout Machine</title>
      </Head>

      <Navbar />

      <div className="pr-8 pl-8">
        <div className="flex flex-col md:grid grid-cols-3 gap-x-5">
          <Card className="relative" withHeight>
            <h1 className="font-black text-xl text-white">sm</h1>

            <p className="text-lightGray font-semibold text-2xl md:text-4xl absolute bottom-10 left-8">
              Elevate your FRC game with smarter data insights.
            </p>
          </Card>

          <Card withHeight>
            <h1 className="text-lightGray text-sm md:text-xl">
              Scout Machine is the all-in-one tool your FRC team needs to find
              the data you want, when you want. From accessing important data
              points to viewing match histories and tracking performance metrics
              - it&apos;s all in one place. <br /> <br />{" "}
              <span className="text-white italic">
                Say goodbye to time-consuming data analysis and hello to{" "}
                <span className="text-primary">Scout Machine</span>.
              </span>
            </h1>
          </Card>
          <Card withHeight>
            <h1 className="font-meidum text-sm md:text-xl text-lightGray">
              We&apos;re 100% open-source on{" "}
              <a
                href="https://github.com/gryphonmachine/machine"
                target="_blank"
                className="text-white"
              >
                <span className="inline-block align-top	ml-1">
                  <FaGithub className="text-2xl" />
                </span>{" "}
                Github.
              </a>
              <br /> <br />
              If you have any questions, feature requests, bug reports, or you
              just want to see some sneak peeks of updates, join our{" "}
              <a
                href="https://discord.gg/yYtc8gpsXK"
                target="_blank"
                className="text-violet-400"
              >
                <span className="inline-block align-top">
                  <FaDiscord className="text-3xl" />
                </span>{" "}
                Discord
              </a>
              .
              <br />
              <br />
              Loving the site & want to support us? <br />{" "}
              <a
                href="https://www.buymeacoffee.com/scoutmachine"
                target="_blank"
                className="text-yellow-400"
              >
                <span className="inline-block align-top">
                  <FaCoffee className="text-3xl" />
                </span>{" "}
                Buy us a Coffee
              </a>
            </h1>
          </Card>
        </div>
        <Card>
          <h1 className="text-2xl text-lightGray font-bold mb-5">
            What are you waiting for?
          </h1>
          <div className="md:flex-row space-y-3 md:space-x-3">
            <Feature name="team pages" />
            <Feature name="event pages" />
            <Feature name="match pages" />
            <Feature name="wide search range" />
            <Feature name="team awards" />
            <Feature name="rookie teams" />
            <Feature name="unique, modern, & simple design" />
            <Feature name="...& so much more" />
          </div>
        </Card>
      </div>

      <Footer />
    </>
  );
}
