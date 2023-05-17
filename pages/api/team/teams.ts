import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getAllTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page } = req.query;
  const data = fetchTBA(`teams/${page}`);

  res.status(200).send(data);
}
