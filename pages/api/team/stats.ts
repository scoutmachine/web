import { NextApiRequest, NextApiResponse } from "next";
import { API_URL } from "@/lib/constants";
import { fetchFIRST } from "@/lib/fetchFIRST";

export default async function getTeamStats(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const fetchDistrict = await fetch(
    `${API_URL}/api/team/districts?team=${team}`
  ).then((res: Response) => res.json());

  if (!fetchDistrict[0]) {
    res.status(400).send([]);
  } else {
    const teamDistrict = fetchDistrict[fetchDistrict.length - 1].abbreviation;
    const teamRanking: any[] = [];

    const firstPageData = await fetchFIRST(
      `/rankings/district?districtCode=${teamDistrict}&page=1`
    );
    teamRanking.push(...firstPageData.districtRanks);

    const totalPages = firstPageData.pageTotal;

    if (totalPages > 1) {
      const remainingPages: number[] = Array.from(
        { length: totalPages - 1 },
        (_, i: number) => i + 2
      );
      const remainingData: any[] = await Promise.all(
        remainingPages.map((page: any) =>
          fetchFIRST(
            `/rankings/district?districtCode=${teamDistrict}&page=${page}`
          )
        )
      );

      remainingData.forEach((pageData: any) =>
        teamRanking.push(...pageData.districtRanks)
      );
    }

    res.status(200).json({
      total: teamRanking.length,
      team: teamRanking.find(
        (rank: any): boolean => rank.teamNumber === Number(team)
      ),
    });
  }
}
