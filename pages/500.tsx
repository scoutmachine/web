import { Navbar } from "@/components/navbar";
import Head from "next/head";
import { JSX } from "react";

export default function Page500(): JSX.Element {
  return (
    <>
      <Head>
        <title>500 - Server Error | Scout Machine</title>
      </Head>
      <Navbar />
      <div className="flex items-center justify-center flex-col mt-32">
        <h1 className="text-5xl text-primary font-black">500 - Server Error</h1>
        <p className="text-lightGray">
          Uh oh, looks like there&apos;s a server issue. We&apos;ll be back
          online soon - hang tight!
        </p>
      </div>
    </>
  );
}
