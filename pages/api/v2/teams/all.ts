import db from "@/lib/db";
import { fetchTBA } from "@/lib/fetchTBA";
import { NextApiRequest, NextApiResponse } from "next";
import { Team } from "@prisma/client";
import {AxiosResponse} from "axios";

const TOTAL_PAGES: number = 21;

export default async function getAllTeams(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const teamsCollectionCount: number = await db.team.count();
  const allTeams: Team[] = await db.team.findMany();

  if (teamsCollectionCount > 0) {
    res.status(200).send(allTeams);
    return;
  }

  const getTeams: any = async (page: string): Promise<AxiosResponse<any> | void> => await fetchTBA(`teams/${page}`);
  const data: any[] = [];

  for (let page: number = 0; page < TOTAL_PAGES; ++page) {
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
