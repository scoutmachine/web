import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getEventMatches(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { event } = req.query;
  return await fetchTBA(res, `event/${event}/matches`);
}
