import { Navbar } from "@/components/Navbar";
import Head from "next/head";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Scout Machine</title>
      </Head>

      <Navbar />

      <div className="flex items-center justify-center mt-32">
        <h1 className="font-bold text-2xl">COMING SOON.</h1>
      </div>

      
    </>
  );
}
