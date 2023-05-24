import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import db from "@/lib/db";

export default async function getMatches(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { event } = req.query;

    const eventMatches = await db.match.findMany({
      where: {
        event_key: String(event),
      },
    });

		return res.status(200).send(eventMatches);
  } catch {
    res.status(400).send("Error");
  }
}
