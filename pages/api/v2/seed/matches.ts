import { tbaAxios } from "@/lib/fetchTBA";
import { RouterBuilder } from "next-api-handler";
import db from "@/lib/db";
import _ from "lodash";
import { Match } from "@prisma/client";

const router = new RouterBuilder();

const handleMatchesETL = async () => {
  console.log("Starting Matches ETL");

  const events = await db.event.findMany();
  let numMatchesInserted = 0;
  const allEvents: any = [];

  for (const event of events) {
    allEvents.push(event.key);

    const eventKey = event.key.toString();
    console.log(`Parsing Matches for ${eventKey}`);
    const matches: any = await tbaAxios.get(`/event/${eventKey}/matches`);

    const data = await matches.data.map((match: Match) => {
      return {
        key: match.key,
        comp_level: match.comp_level,
        set_number: match.set_number,
        alliances: match.alliances ?? null,
        winning_alliance: match.winning_alliance,
        event_key: match.event_key,
        time: match.time,
        actual_time: match.actual_time,
        predicted_time: match.predicted_time,
        post_result_time: match.post_result_time,
        score_breakdown: match.score_breakdown ?? null,
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
  return allEvents;
};

router.post(async (req, res) => {
  try {
    const matchesInserted = await handleMatchesETL();

    res.status(200).json({
      message: "Success",
      matchesInserted,
    });
  } catch (error) {
    console.log("error: ", error);
  }
});

export default router.build();
