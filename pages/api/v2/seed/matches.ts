import { tbaAxios } from "@/lib/fetchTBA";
import { RouterBuilder } from "next-api-handler";
import db from "@/lib/db";
import { Match, Prisma } from "@prisma/client";

const router = new RouterBuilder();

const handleMatchesETL = async () => {
  console.log("Starting Matches ETL");

  const events = await db.event.findMany();
  let numMatchesInserted = 0;

  for (const event of events) {
    console.log(`Parsing Matches for ${event.key}`);
    const matches: any = await tbaAxios.get(`/event/${event.key}/matches`);

    const data = await matches.data.map((match: Match) => {
      return {
        key: match.key ?? null,
        comp_level: match.comp_level ?? null,
        set_number: match.set_number ?? null,
        match_number: match.match_number ?? null,
        alliances: match.alliances ?? null,
        winning_alliance: match.winning_alliance ?? null,
        event_key: match.event_key ?? null,
        time: match.time ?? null,
        actual_time: match.actual_time ?? null,
        predicted_time: match.predicted_time ?? null,
        post_result_time: match.post_result_time ?? null,
        score_breakdown: match.score_breakdown ?? Prisma.DbNull,
        videos: match.videos ?? null,
      };
    });

    const result = await db.match.createMany({
      data: data,
      skipDuplicates: true,
    });

    numMatchesInserted += result.count;
  }

  console.log("Finished Matches ETL");
  return numMatchesInserted;
};

router.post(async (req, res) => {
  try {
    res.status(200).json({
      message: "Success",
    });

    await handleMatchesETL();
  } catch (error) {
    console.log("error: ", error);
  }
});

export default router.build();
