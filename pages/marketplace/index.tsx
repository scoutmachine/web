import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CreateListingModal } from "@/components/modals/CreateListingModal";
import { Navbar } from "@/components/navbar";
import { MarketplaceScreen } from "@/components/screens/MarketplaceScreen";
import db from "@/lib/db";
import { GetServerSideProps } from "next";
import { getServerSession, Session, User } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { authOptions } from "../api/auth/[...nextauth]";
import { Post } from ".prisma/client";
import { SEO } from "@/components/SEO";

export default function MarketplacePage({ posts, user }: any) {
  const { data: session } = useSession();
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);

  return (
    <>
      <SEO title="Marketplace / Scout Machine" />

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
                className="flex bg-card border border-[#2a2a2a] rounded-lg text-md px-5 py-1 mt-5 transition-all delay-100 text-lightGray hover:text-primary dark:text-white"
              >
                <FaMoneyBill className="mr-2 text-3xl" /> Sell your parts
              </button>
            )}
          </>
        }
      />

      <MarketplaceScreen marketplacePosts={posts} user={user} />

      <Footer />

      <CreateListingModal
        isOpen={showCreateListingModal}
        setOpen={setShowCreateListingModal}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}): Promise<{ props: { posts: any; user: any } }> => {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;
  let user;

  if (session) {
    user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
  }

  const posts: (Post & { author: User })[] = await db.post.findMany({
    where: {},
    include: {
      author: true,
    },
  });

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts.sort(() => Math.random() - 0.5))),
      user: session ? JSON.parse(JSON.stringify(user)) : null,
    },
  };
};
