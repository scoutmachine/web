import { log } from "@/utils/log";
import axios, { AxiosResponse } from "axios";

export const fetchTBA = async (route: string) => {
  if (!process.env.BLUE_ALLIANCE_API_KEY)
    log("error", "BLUE_ALLIANCE_API_KEY not provided");

  return await axios
    .get(`https://www.thebluealliance.com/api/v3/${route}`, {
      headers: {
        "X-TBA-Auth-Key": process.env.BLUE_ALLIANCE_API_KEY,
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data)
    .catch((error) => log("error", error));
};
