import { Navbar } from "@/components/Navbar";
import Head from "next/head";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Scout Machine</title>
      </Head>

      <Navbar />

      <div
        className="flex flex-col items-center justify-center pl-8 pr-8 md:block hidden"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <h1 className="slideLeft uppercase text-7xl font-black text-white mr-[400px]">
          FRC Data At Your
        </h1>
        <h1 className="scaleOut uppercase text-8xl font-black text-primary z-10">
          Scout Machine
        </h1>
        <h1 className="slideRight uppercase text-7xl font-black text-white ml-[600px]">
          Fingertips
        </h1>
      </div>
    </>
  );
}
