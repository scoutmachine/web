import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { AxiosResponse } from "axios";

export default async function getMatchInfo(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { match } = req.query;
  const data: void | AxiosResponse<any, any> = await fetchTBA(`match/${match}`);

  res.status(200).send(data);
}
