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
      const createdMatches = await Promise.allSettled(
        matches.map(async (match: any) => {
          try {
            const createdMatch = await db.match.upsert({
              where: {
                key: match.key,
              },
              create: {
                ...match,
              },
              update: {},
            });
            return { status: "fulfilled", value: createdMatch };
          } catch (error) {
            return { status: "rejected", reason: error };
          }
        })
      );

      const successfulMatches = createdMatches
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<any>).value);

      res.status(200).send((successfulMatches as any).value);
    }
  } catch {
    res.status(400).send("Error");
  }
}
