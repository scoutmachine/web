import { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "@/lib/fetchData";
import { CURR_YEAR } from "@/lib/constants";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await fetchData(res, `events/${CURR_YEAR}`);
}