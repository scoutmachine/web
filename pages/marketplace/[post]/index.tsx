import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/navbar";
import { MarketplacePage } from "@/components/screens/marketplace/MarketplacePage";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import db from "@/lib/db";
import { Post } from ".prisma/client";
import { User } from "next-auth";
import { SEO } from "@/components/SEO";

export default function MarketplacePostPage({ post }: any) {
  const title = `${post.title} | Marketplace / Scout Machine`;

  return (
    <>
      <SEO title={title} />
      <Navbar />
      
      <MarketplacePage marketplacePost={post} />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<any> => {
  const { post }: any = context.params;

  const getPostData: (Post & { author: User }) | null =
    await db.post.findUnique({
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
