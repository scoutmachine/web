import { API_URL } from "@/lib/constants";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LiveFieldViewPage({ next }: any) {
  const router = useRouter();

  useEffect(() => {
    router.push(
      `https://twitch.tv/${
        next.event.webcasts[next.event.webcasts.length - 1].channel
      }`
    );
  });
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { team }: any = context.params;

  const nextMatch = await fetch(`${API_URL}/api/team/next?team=${team}`).then(
    (res) => res.json()
  );

  return { props: { next: nextMatch } };
};
