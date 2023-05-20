import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamEventMatches(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team, year, event } = req.query;
  const data = await fetchTBA(`team/frc${team}/event/${year}${event}/matches`);

  res.status(200).send(data);
}
