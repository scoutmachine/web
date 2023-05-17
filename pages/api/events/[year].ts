import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getAllEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { year } = req.query;
  const data = await fetchTBA(`events/${year}`);

  res.status(200).send(data);
}
