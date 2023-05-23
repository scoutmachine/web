import db from "@/lib/db";
import { fetchTBA } from "@/lib/fetchTBA";
import { NextApiRequest, NextApiResponse } from "next";

const TOTAL_PAGES = 21;

export default async function getAllTeams(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const teamsCollectionCount = await db.team.count();
  const allTeams = await db.team.findMany();

  if (teamsCollectionCount > 0) {
    res.status(200).send(allTeams);
    return;
  }

  const getTeams = async (page: string) => await fetchTBA(`teams/${page}`);
  const data: any[] = [];

  for (let page = 0; page < TOTAL_PAGES; ++page) {
    const teams: any = await getTeams(page.toString());
    const pageData = teams.map((team: any) => ({ ...team }));
    data.push(...pageData);
  }

  await db.team.createMany({
    data,
    skipDuplicates: true,
  });

  res.status(200).send(data);
}
