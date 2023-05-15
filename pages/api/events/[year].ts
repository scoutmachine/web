import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getAllEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { year } = req.query;
  return await fetchTBA(res, `events/${year}`);
}
