import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { MarketplacePage } from "@/components/screens/marketplace/MarketplacePage";
import { GetServerSideProps } from "next";
import Head from "next/head";
import db from "@/lib/db";

export default function MarketplacePostPage({ post }: any) {
  return (
    <>
      <Head>
        <title>{post.title} | Marketplace / Scout Machine</title>
      </Head>

      <Navbar />
      <MarketplacePage marketplacePost={post} />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { post }: any = context.params;

  const getPostData = await db.post.findUnique({
    where: {
      id: Number(post),
    },
    include: { author: true },
  });

  if (getPostData) {
    return { props: { post: getPostData } };
  }

  return { props: {} };
};
