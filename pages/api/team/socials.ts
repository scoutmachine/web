import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamSocials(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  const data = await fetchTBA(`team/frc${team}/social_media`);

  res.status(200).json(data);
}
