import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import db from "@/lib/db";

export default async function getEventRankings(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { event } = req.query;

    const matches: any = await fetchTBA(`event/${event}/matches`);
    const eventMatches = await db.match.findMany({
      where: {
        event_key: String(event),
      },
    });

    if (eventMatches.length > 0) {
      res.status(200).send(eventMatches);
    } else {
      await Promise.all(
        matches.map(
          async (match: any) =>
            await db.match.createMany({
              data: {
                ...match,
              },
              skipDuplicates: true,
            })
        )
      );

      res.status(200).send("Success");
    }
  } catch {
    res.status(400).send("Error");
  }
}
