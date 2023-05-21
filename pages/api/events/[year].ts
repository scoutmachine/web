import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { AxiosResponse } from "axios";

export default async function getAllEvents(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { year } = req.query;
  const data: void | AxiosResponse<any, any> = await fetchTBA(`events/${year}`);

  res.status(200).send(data);
}
