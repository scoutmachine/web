import { CURR_YEAR } from "@/lib/constants";
import { fetchFIRST } from "@/lib/fetchFIRST";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getTeamsAndAvatars(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const districts = [
    "CHS",
    "FIM",
    "FIT",
    "FIN",
    "ISR",
    "FMA",
    "FNC",
    "NE",
    "ONT",
    "PNW",
    "PCH",
  ];

  const topTeams: any = [];

  await Promise.all(
    districts.map(async (district: any) => {
      const data = await fetchFIRST(
        `/rankings/district?districtCode=${district}`
      ).then((res) => res.data.districtRanks[0]);
      topTeams.push(data);
    })
  );

  res.status(200).json({ top: topTeams });
}
