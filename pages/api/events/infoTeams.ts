import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { Team } from "@prisma/client";

export default async function getEventTeams(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { event } = req.query;

  // @ts-ignore
  const rest: Team[] = await db.team.findMany({
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
