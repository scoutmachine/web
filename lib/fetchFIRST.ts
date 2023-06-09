import axios, { AxiosResponse } from "axios";
import { CURR_YEAR } from "./constants";
import { log } from "@/utils/log";

export const fetchFIRST = async (
  route?: string,
  year?: number
): Promise<AxiosResponse<any> | void> => {
  if (!process.env.FIRST_API_KEY) log("error", "FIRST_API_KEY not provided");

  return await axios
    .get(
      `https://frc-api.firstinspires.org/v3.0/${year ?? CURR_YEAR}${
        route ? route : ""
      }`,
      {
        headers: {
          Authorization: `Basic ${process.env.FIRST_API_KEY}`,
        },
      }
    )
    .then((response: AxiosResponse<any, any>) => response.data)
    .catch((error) => log("error", error));
};
