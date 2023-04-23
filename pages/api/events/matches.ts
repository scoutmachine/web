import { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "@/lib/fetchData";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team, year, event } = req.query;
  return await fetchData(res, `team/frc${team}/event/${year}${event}/matches`);
}