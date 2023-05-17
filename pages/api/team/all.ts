import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { getTeamAvatar } from "./avatar";

export default async function getAllTeamInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  return await Promise.all([
    fetchTBA(res, `team/frc${team}`),
    getTeamAvatar(req),
    fetchTBA(res, `team/frc${team}/social_media`),
    fetchTBA(res, `team/frc${team}/years_participated`),

  ])
}
