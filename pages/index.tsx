import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <div
        className="flex flex-col items-center justify-center pl-8 pr-8"
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
