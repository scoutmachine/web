import { API_URL } from "@/lib/constants";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { NextRouter, useRouter } from "next/router";
import { useEffect } from "react";

export default function LiveFieldViewPage({ next }: any): null {
  const router: NextRouter = useRouter();

  useEffect((): void => {
    const channel = next.event.webcasts.reduce((acc: string, item: any) => {
      return item.channel.length > acc.length ? item.channel : acc;
    }, "");

    router.push(`https://twitch.tv/${channel}`);
  }, [next.event.webcasts, router]);

  return null;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
):  Promise<{props: {next: any}}> => {
  const { team }: any = context.params;

  const nextMatch = await fetch(`${API_URL}/api/teams/next?team=${team}`).then(
    (res: Response) => res.json()
  );

  return { props: { next: nextMatch } };
};
