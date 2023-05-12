import { fetchFIRST } from "@/lib/fetchFIRST";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const districts = await fetchFIRST("/districts").then((res) => res.data);
  res.status(200).send(districts);
}
