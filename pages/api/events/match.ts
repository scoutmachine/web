import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getMatchInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { match } = req.query;
  return await fetchTBA(res, `match/${match}`);
}
