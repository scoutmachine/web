import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { AxiosResponse } from "axios";

export default async function getTeamEvents(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const data: void | AxiosResponse<any, any> = await fetchTBA(
    `team/frc${team}/events`
  );

  res.status(200).send(data);
}
