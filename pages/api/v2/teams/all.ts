import db from "@/lib/db";
import { fetchTBA } from "@/lib/fetchTBA";
import { NextApiRequest, NextApiResponse } from "next";

const MAX_PAGE_SIZE = 200;
const MAX_TEAMS = 9999;

export default async function getAllTeams(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const teamsCollectionExists = await db.team.findMany();

  if (teamsCollectionExists) {
    return res.status(200).send(teamsCollectionExists);
  }

  const getTeams = async (page: string) => await fetchTBA(`teams/${page}`);
  const totalPages = Math.ceil(MAX_TEAMS / MAX_PAGE_SIZE);
  const data: any[] = [];

  for (let page = 0; page < totalPages; page++) {
    const teams: any = await getTeams(page.toString());
    const pageData = teams.map((team: any) => ({ ...team }));
    data.push(...pageData.slice(0, MAX_PAGE_SIZE));
  }

  await db.team.createMany({
    data,
    skipDuplicates: true,
  });

  res.status(200).send(data);
}
