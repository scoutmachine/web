import { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "@/lib/fetchData";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event } = req.query;
  return await fetchData(res, `event/${event}/teams/simple`);
}
