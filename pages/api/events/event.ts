import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { AxiosResponse } from "axios";

export default async function getEventMatches(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { event } = req.query;
  const data: void | AxiosResponse<any, any> = await fetchTBA(
    `event/${event}/matches`
  );

  res.status(200).send(data);
}
