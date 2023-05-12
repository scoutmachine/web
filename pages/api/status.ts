import { CURR_YEAR } from "@/lib/constants";
import { fetchFIRST } from "@/lib/fetchFIRST";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await fetchFIRST().then((response) => response.data);
  res.status(200).json({
    season: CURR_YEAR,
    data: {
      ...data,
    },
  });
}
