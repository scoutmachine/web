import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";

export default function MarketplacePage() {
  return (
    <>
      <Navbar active="Marketplace" />

      <Header
        title="Marketplace"
        desc="Have FRC parts you don't use anymore? Looking to sell or buy?"
      />

      <Footer />
    </>
  );
}
