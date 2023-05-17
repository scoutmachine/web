import { NextApiRequest, NextApiResponse } from "next";
import { fetchFIRST } from "@/lib/fetchFIRST";

export default async function getTeamAwards(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team, year } = req.query;
  const currentYear = new Date().getFullYear();
  const startYear = parseInt(year as string);

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const awards = await Promise.all(
    years.map(async (year) => {
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
    .filter((award) => award)
    .reduce((acc, curr) => {
      return acc.concat(
        curr?.data.Awards.map((award: any) => {
          return {
            year: curr.year,
            ...award,
          };
        })
      );
    }, []);

  res.status(200).send(data);
}
