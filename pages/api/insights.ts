import { fetchFIRST } from "@/lib/fetchFIRST";
import { NextApiRequest, NextApiResponse } from "next";
import { districts } from "@/lib/lists/districts";

export default async function getTeamsAndAvatars(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const topTeams: any = [];

  await Promise.all(
    districts.map(async (district: any) => {
      const data = await fetchFIRST(
        `/rankings/district?districtCode=${district}`
      ).then((res) => res.data.districtRanks[0]);
      topTeams.push(data);
    })
  );

  res.status(200).json({ top: topTeams.sort() });
}
