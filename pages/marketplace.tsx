import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import Head from 'next/head'

export default function MarketplacePage() {
  return (
    <>
      <Head>
        <title>Marketplace | Scout Machine</title>
      </Head>

      <Navbar active="Marketplace" />

      <Header
        title="Marketplace"
        desc="Have FRC parts you don't use anymore? Looking to sell or buy?"
      />

      <Footer />
    </>
  );
}
