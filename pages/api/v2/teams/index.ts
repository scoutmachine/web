import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;

  const fetchTeam = await db.team.findUnique({
    where: {
      team_number: Number(team),
    },
  });

  res.status(200).send(fetchTeam);
}
