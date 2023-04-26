import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { team } = req.query;

    const response = await axios.get(
      `https://frc-api.firstinspires.org/v3.0/2023/avatars?teamNumber=${team}`,
      {
        headers: {
          Authorization: `Basic ${process.env.FIRST_API_KEY}`,
        },
      }
    );

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
