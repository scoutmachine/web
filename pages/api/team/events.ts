import { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "@/lib/fetchData";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team, year } = req.query;
  return await fetchData(res, `team/frc${team}/events/${year}`);
}