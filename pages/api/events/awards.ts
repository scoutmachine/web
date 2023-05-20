import { NextApiRequest, NextApiResponse } from "next";
import { fetchFIRST } from "@/lib/fetchFIRST";

export default async function getEventAwards(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { event } = req.query;
  const data = await fetchFIRST(`/awards/event/${event}`);

  const newAwards = data.Awards.map((award: any) => ({
    awardId: award.awardId,
    name: award.name,
    teamNumber: award.teamNumber,
    person: award.person,
  }));

  res.status(200).send(newAwards);
}
