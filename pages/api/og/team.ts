import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { fetchTeamAvatar } from "../teams/avatar";

export default async function getStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const avatar = await fetchTeamAvatar(req);

  const teamData = await db.team.findUnique({
    where: {
      team_number: Number(team),
    },
  });

  res.status(200).json({ teamData, avatar: avatar.avatar });
}
