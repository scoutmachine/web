import { fetchFIRST } from "@/lib/fetchFIRST";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const districts = await fetchFIRST("/districts");
  res.status(200).send(districts);
}
