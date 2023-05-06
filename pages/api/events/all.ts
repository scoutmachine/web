import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { CURR_YEAR } from "@/lib/constants";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await fetchTBA(res, `events/${CURR_YEAR}`);
}
