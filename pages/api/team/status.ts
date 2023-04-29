import { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "@/lib/fetchData";
import { CURR_YEAR } from "@/lib/constants";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  return await fetchData(res, `team/frc${team}/events/${CURR_YEAR}/statuses`);
}