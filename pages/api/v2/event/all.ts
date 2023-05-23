import { NextApiRequest, NextApiResponse } from "next";
import { Event } from "@prisma/client";
import { tbaAxios } from "@/lib/fetchTBA";
import { CURR_YEAR } from "@/lib/constants";
import db from "@/lib/db";

export default async function getEventRankings(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { year = CURR_YEAR } = req.query;
    const { data } = await tbaAxios.get<Event[]>(`events/${year}`);

    // TODO: Add models in later
    const formattedData = data.map((event) => {
      return {
        ...event,
        webcasts: undefined,
        district: undefined,
      };
    });

    const response = await db.event.createMany({
      data: formattedData,
      skipDuplicates: true,
    });

    return res.send({
      message: `${response.count} events were created`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message ?? error });
  }
}
