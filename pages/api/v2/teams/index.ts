import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Team } from "@prisma/client";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;

  const fetchTeam: Team | null = await db.team.findUnique({
    where: {
      team_number: Number(team),
    },
  });

  res.status(200).send(fetchTeam);
}
