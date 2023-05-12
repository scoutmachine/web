import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamSocials(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  return await fetchTBA(res, `team/frc${team}/social_media`);
}
