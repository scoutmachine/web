import { NextApiRequest, NextApiResponse } from "next";
import { API_URL } from "@/lib/constants";
import { fetchFIRST } from "@/lib/fetchFIRST";

export default async function getTeamDistrict(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  const fetchDistrict = await fetch(
    `${API_URL}/api/team/districts?team=${team}`
  ).then((res) => res.json());

  if (!fetchDistrict[0]) {
    res.status(400).send([]);
  } else {
    const teamDistrict = fetchDistrict[fetchDistrict.length - 1].abbreviation;
    const teamRanking: any[] = [];

    const firstPageData = await fetchFIRST(
      `/rankings/district?districtCode=${teamDistrict}&page=1`
    );
    teamRanking.push(...firstPageData.data.districtRanks);

    const totalPages = firstPageData.data.pageTotal;

    if (totalPages > 1) {
      const remainingPages = Array.from(
        { length: totalPages - 1 },
        (_, i) => i + 2
      );
      const remainingData = await Promise.all(
        remainingPages.map((page: any) =>
          fetchFIRST(
            `/rankings/district?districtCode=${teamDistrict}&page=${page}`
          ).then((res) => res.data)
        )
      );

      remainingData.forEach((pageData: any) =>
        teamRanking.push(...pageData.districtRanks)
      );
    }

    res.status(200).json({
      team: teamRanking.find((rank: any) => rank.teamNumber === Number(team)),
    });
  }
}
