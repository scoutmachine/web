import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { MarketplacePost } from "@/components/screens/MarketplacePost";
import Head from "next/head";

export default function MarketplacePostPage({
  marketplacePost,
}: {
  marketplacePost: any;
}) {
  {
    return (
      <>
        <Head>
          <title>Post Title| Marketplace | Scout Machine</title>
        </Head>

        <Navbar active="Marketplace" />

        <MarketplacePost marketplacePost={marketplacePost} />

        <Footer />
      </>
    );
  }
}
