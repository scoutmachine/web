import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { AxiosResponse } from "axios";

export default async function getTeamEventMatches(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team, year, event } = req.query;
  const data: void | AxiosResponse<any, any> = await fetchTBA(
    `team/frc${team}/event/${year}${event}/matches`
  );

  res.status(200).send(data);
}
