import { fetchFIRST } from "@/lib/fetchFIRST";
import { NextApiRequest, NextApiResponse } from "next";
import { districts } from "@/lib/lists/districts";

export default async function getInsights(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const topTeams: any = [];

  await Promise.all(
    districts.map(async (district: any) => {
      const data = await fetchFIRST(
        `/rankings/district?districtCode=${district}`
      );
      topTeams.push(data.districtRanks[0]);
    })
  );

  res.status(200).json({ top: topTeams.sort() });
}
