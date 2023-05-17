import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { fetchTeamAvatar } from "./avatar";

export default async function getAllTeamInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  const data = await Promise.all([
    fetchTBA(`team/frc${team}`),
    fetchTeamAvatar(req),
    fetchTBA(`team/frc${team}/social_media`),
    fetchTBA(`team/frc${team}/years_participated`),
  ]);

  res.status(200).send(data);
}
