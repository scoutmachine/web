import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { fetchTeamAvatar } from "../teams/avatar";
import { Team } from "@prisma/client";

export default async function getStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const avatar:
    | { avatar: null; status: any }
    | { avatar: any; status: any }
    | { avatar: null; status: number } = await fetchTeamAvatar(req);

  const teamData: Team | null = await db.team.findUnique({
    where: {
      team_number: Number(team),
    },
  });

  res.status(200).json({ teamData, avatar: avatar.avatar });
}
