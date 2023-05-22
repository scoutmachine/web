import { NextApiRequest, NextApiResponse } from "next";
import { Event, PrismaClient } from "@prisma/client";
import { tbaAxios } from "@/lib/fetchTBA";
import { CURR_YEAR } from "@/lib/constants";

const primsa = new PrismaClient();

export default async function getEventRankings(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
		const { year = CURR_YEAR } = req.query;
    console.log(`Refreshing events for ${year}`);

    const { data } = await tbaAxios.get<Event[]>(`events/${year}`);
    console.log(`Got ${data.length} events from TBA`);

    // TODO: Add models in later
    const formattedData = data.map((event) => {
      return {
        ...event,
        webcasts: undefined,
        district: undefined,
      };
    });

    const response = await primsa.event.createMany({
      data: formattedData,
      skipDuplicates: true,
    });

    return res.send({
      message: `${response.count} events were created`,
    });
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? error });
  }
}
