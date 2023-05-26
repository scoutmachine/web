import { fetchFIRST } from "@/lib/fetchFIRST";
import { NextApiRequest, NextApiResponse } from "next";
import { AxiosResponse } from "axios";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const districts: void | AxiosResponse<any, any> = await fetchFIRST(
    "/districts"
  );
  res.status(200).send(districts);
}
