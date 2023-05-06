import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { CURR_YEAR } from "@/lib/constants";
import { fetchFIRST } from "@/lib/fetchFIRST";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { team } = req.query;

    const response = await fetchFIRST(`/avatars?teamNumber=${team}`);

    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).send("API request failed");
    }

    res.status(200).json({
      avatar:
        response.data.teams.length > 0
          ? response.data.teams[0].encodedAvatar
          : null,
    });
  } catch (error) {
    res.status(500).json({ avatar: null });
  }
}
