import { GetServerSideProps, GetServerSidePropsContext } from "next";
import WrappedPlayerComponent from "@/components/wrapped/WrappedPlayerComponent";
// import db from "@/lib/db";
// import { Match } from "@prisma/client";
import { useRouter } from "next/router";
import { SpotifyPlayer } from "@/components/wrapped/spotify/SpotifyPlayer";
import SpotifyFramePlayer from "@/components/wrapped/spotify/FramePlayer";
import { useEffect, useState } from "react";
import { IntroSlide } from "@/components/wrapped/slides/IntroSlide";

export default function TeamWrapPage() {
  const router = useRouter();
  const { team } = router.query;
  const [spotify, setSpotify] = useState<SpotifyFramePlayer | null>(null);
  const [page, setPage] = useState("main");

  useEffect(() => {
    const loadSpotify = async () => {
      const getSpotify = new SpotifyFramePlayer();
      await getSpotify.loadLibrary();
      setSpotify(getSpotify);
    };

    if (!spotify) loadSpotify();
  });

  return (
    <>
      <SpotifyPlayer />

      {page === "main" && <IntroSlide team={team} setPage={setPage} />}

      {page === "ready" && (
        <WrappedPlayerComponent team={team} spotify={spotify} />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<{ props: any }> => {
  const { team }: any = context.params;

  // const teamMatches = await db.match.findMany({
  //   where: {
  //     event_key: {
  //       contains: "2023",
  //     },
  //     OR: [
  //       {
  //         alliances: {
  //           path: ["red", "team_keys"],
  //           array_contains: `frc${team}`,
  //         },
  //       },
  //       {
  //         alliances: {
  //           path: ["blue", "team_keys"],
  //           array_contains: `frc${team}`,
  //         },
  //       },
  //     ],
  //   },
  // });

  // const highestScoringMatches: Match[] = teamMatches
  //   .sort((a: any, b: any) => {
  //     const scoreA = a.alliances.red.score + a.alliances.blue.score;
  //     const scoreB = b.alliances.red.score + b.alliances.blue.score;
  //     return scoreB - scoreA;
  //   })
  //   .slice(0, 2);

  return {
    props: {
      // teamMatches: JSON.parse(
      //   JSON.stringify(
      //     highestScoringMatches,
      //     (key: string, value) =>
      //       typeof value === "bigint" ? value.toString() : value // return everything else unchanged
      //   )
      // ),
    },
  };
};
