import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { CURR_YEAR } from "@/lib/constants";

export default async function getTeamStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  return await fetchTBA(res, `team/frc${team}/events/${CURR_YEAR}/statuses`);
}
