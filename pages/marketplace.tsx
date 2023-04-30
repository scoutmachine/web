import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";

export default function MarketplacePage() {
  return (
    <>
      <Navbar />

      <Header title="Marketplace" desc="Have FRC parts you don't use anymore? Looking to sell or buy?" />

      <Footer />
    </>
  );
}
