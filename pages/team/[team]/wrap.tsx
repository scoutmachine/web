import { GetServerSideProps, GetServerSidePropsContext } from "next";
import WrappedPlayerComponent from "@/components/wrapped/WrappedPlayerComponent";
import db from "@/lib/db";
import { useRouter } from "next/router";
import { SpotifyPlayer } from "@/components/wrapped/spotify/SpotifyPlayer";
import SpotifyFramePlayer from "@/components/wrapped/spotify/FramePlayer";
import { useEffect, useState } from "react";
import { IntroSlide } from "@/components/wrapped/slides/IntroSlide";
import { SEO } from "@/components/SEO";

export default function TeamWrapPage({
  totalEvents,
  totalAwards,
  teamMatches,
  totalFavourited,
}: any) {
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

  const title = `${team}'s Wrapped / Scout Machine`;

  return (
    <>
      <SEO title={title} />

      <SpotifyPlayer />

      {page === "main" && <IntroSlide team={team} setPage={setPage} />}

      {page === "ready" && (
        <WrappedPlayerComponent
          team={team}
          spotify={spotify}
          teamMatches={teamMatches}
          totalEvents={totalEvents}
          totalAwards={totalAwards}
          totalFavourited={totalFavourited}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<{ props: any }> => {
  const { team }: any = context.params;

  const [teamMatches, totalEvents, totalAwards, totalFavourited] =
    await Promise.all([
      await db.match.findMany({
        where: {
          event_key: {
            contains: "2023",
          },
          OR: [
            {
              alliances: {
                path: ["red", "team_keys"],
                array_contains: `frc${team}`,
              },
            },
            {
              alliances: {
                path: ["blue", "team_keys"],
                array_contains: `frc${team}`,
              },
            },
          ],
        },
      }),
      await db.event.count({
        where: {
          key: {
            contains: "2023",
          },
          teams: {
            some: {
              team_number: Number(team),
            },
          },
        },
      }),
      await db.award.count({
        where: {
          recipient_list: {
            array_contains: [{ awardee: null, team_key: `frc${team}` }],
          },
          year: 2023,
        },
      }),
      await db.favouritedTeam.count({
        where: {
          team_number: Number(team),
        },
      }),
    ]);

  return {
    props: {
      totalEvents,
      totalAwards,
      totalFavourited,
      teamMatches: JSON.parse(
        JSON.stringify(
          teamMatches,
          (key: string, value) =>
            typeof value === "bigint" ? value.toString() : value // return everything else unchanged
        )
      ),
    },
  };
};
