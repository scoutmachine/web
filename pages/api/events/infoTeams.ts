import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function getEventTeams(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { event } = req.query;

  const rest = await db.team.findMany({
    where: {
      events: {
        some: {
          key: event as string,
        },
      },
    },
  });

  res.status(200).send(rest);
}
