import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamEventMatches(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team, year, event } = req.query;
  return await fetchTBA(res, `team/frc${team}/event/${year}${event}/matches`);
}
