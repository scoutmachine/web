import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { SignedOutScreen } from "@/components/landing/SignedOut";
import { SignedInScreen } from "@/components/landing/SignedIn";
import { Loading } from "@/components/Loading";

export default function LandingPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  if (session) {
    return (
      <>
        <Head>
          <title>Scout Machine</title>
        </Head>
        <Navbar dontScroll={true} />
        <SignedInScreen session={session} />
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Scout Machine</title>
        </Head>

        <Navbar dontScroll={true} />
        <SignedOutScreen />
        <Footer />
      </>
    );
  }
}
