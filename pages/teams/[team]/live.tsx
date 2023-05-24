import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LiveFieldViewPage({ next }: any) {
  const router = useRouter();

  useEffect(() => {
    const channel = next.event.webcasts.reduce((acc: string, item: any) => {
      return item.channel.length > acc.length ? item.channel : acc;
    }, "");

    router.push(`https://twitch.tv/${channel}`);
  }, [next.event.webcasts, router]);

  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { team }: any = context.params;

  const nextMatch = await fetch(`${API_URL}/api/team/next?team=${team}`).then(
    (res) => res.json()
  );

  return { props: { next: nextMatch } };
};
