import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CreateListingModal } from "@/components/modals/CreateListingModal";
import { Navbar } from "@/components/navbar";
import { MarketplaceScreen } from "@/components/screens/MarketplaceScreen";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { FaMoneyBill } from "react-icons/fa";

export default function MarketplacePage({
  posts,
}: {
  posts: (any & {
    author: {
      name: string;
      image: string;
    };
  })[];
}) {
  const { data: session } = useSession();
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);

  return (
    <>
      <Head>
        <title>Marketplace | Scout Machine</title>
      </Head>

      <Navbar active="Marketplace" />

      <Header
        title="Marketplace"
        desc={
          <>
            <p>
              Have FRC parts you don&apos;t use anymore? Looking to sell or buy?
            </p>

            {session && (
              <button
                onClick={() => setShowCreateListingModal(true)}
                className="flex bg-card border border-[#2a2a2a] rounded-lg text-md px-5 py-1 mt-5 transition-all delay-100 text-lightGray hover:text-white"
              >
                <FaMoneyBill className="text-3xl mr-2" /> Sell your parts
              </button>
            )}
          </>
        }
      />

      <MarketplaceScreen marketplacePosts={posts} />

      <Footer />

      <CreateListingModal
        isOpen={showCreateListingModal}
        setOpen={setShowCreateListingModal}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await db.post.findMany({
    where: {},
    include: {
      author: true,
    },
  });
  return { props: { posts: JSON.parse(JSON.stringify(posts)) } };
};
