import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import {AxiosResponse} from "axios";

export default async function getAllTeams(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { page } = req.query;
  const data: void | AxiosResponse<any, any> = await fetchTBA(`teams/${page}`);

  res.status(200).send(data);
}
