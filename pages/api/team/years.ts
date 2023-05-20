import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamYearsParticipated(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const data = await fetchTBA(`team/frc${team}/years_participated`);

  res.status(200).send(data);
}
