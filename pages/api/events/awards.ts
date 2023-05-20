import { NextApiRequest, NextApiResponse } from "next";
import { fetchFIRST } from "@/lib/fetchFIRST";

export default async function getEventAwards(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { event } = req.query;
  const data = await fetchFIRST(`/awards/event/${event}`);

  res.status(200).send(data.Awards);
}
