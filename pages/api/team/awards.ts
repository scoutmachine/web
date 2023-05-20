import { NextApiRequest, NextApiResponse } from "next";
import { fetchFIRST } from "@/lib/fetchFIRST";

export default async function getTeamAwards(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const {team, year} = req.query;
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(year as string);

    const years: number[] = Array.from(
        {length: currentYear - startYear + 1},
        (_, i) => startYear + i
    );

    const awards = await Promise.all(
    years.map(async (year: number) => {
      try {
        const response = await fetchFIRST(`/awards/team/${team}`, year);
        return {
          year: year.toString(),
          data: response,
        };
      } catch {
        return null;
      }
    })
  );

  const data = awards
      .filter((award) => award && award.data && award.data.Awards)
      .reduce((acc: never[], curr): never[] => {
          if (curr?.data?.Awards) {
              return acc.concat(
                  curr.data.Awards.map((award: any) => {
                      return {
                          year: curr.year,
                          eventCode: award.eventCode,
                          name: award.name,
                          teamNumber: award.teamNumber,
                      };
                  })
        );
      }
      return acc;
    }, []);

  res.status(200).send(data);
}
