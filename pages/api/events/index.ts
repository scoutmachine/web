import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  const data = await fetchTBA(`team/frc${team}/events`);

  res.status(200).send(data);
}
