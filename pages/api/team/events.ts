import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team, year } = req.query;
  return await fetchTBA(res, `team/frc${team}/events/${year}`);
}
