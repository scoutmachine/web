import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import {AxiosResponse} from "axios";

export default async function getTeamYearsParticipated(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const data: void | AxiosResponse<any, any> = await fetchTBA(`team/frc${team}/years_participated`);

  res.status(200).send(data);
}
