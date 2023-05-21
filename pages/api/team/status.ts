import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { CURR_YEAR } from "@/lib/constants";
import { AxiosResponse } from "axios";

export default async function getTeamStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const data: void | AxiosResponse<any, any> = await fetchTBA(
    `team/frc${team}/events/${CURR_YEAR}/statuses`
  );

  res.status(200).send(data);
}
