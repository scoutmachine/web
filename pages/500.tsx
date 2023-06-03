import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/navbar";
import { JSX } from "react";

export default function Page500(): JSX.Element {
  return (
    <>
      <SEO title="500 - Server Error / Scout Machine" />
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
