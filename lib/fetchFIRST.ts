import axios from "axios";
import { CURR_YEAR } from "./constants";

export const fetchFIRST = async (route?: string) => {
  return await axios.get(
    `https://frc-api.firstinspires.org/v3.0/${CURR_YEAR}${route ? route : ""}`,
    {
      headers: {
        Authorization: `Basic ${process.env.FIRST_API_KEY}`,
      },
    }
  );
};