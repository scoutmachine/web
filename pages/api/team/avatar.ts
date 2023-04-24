import { NextApiRequest, NextApiResponse } from "next";
import { fetchData } from "@/lib/fetchData";
import axios from "axios";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  await axios
    .get(
      `https://frc-api.firstinspires.org/v3.0/2023/avatars?teamNumber=${team}`,
      {
        headers: {
          Authorization: `Basic ${process.env.FIRST_API_KEY}`,
        },
      }
    )
    .then((response) =>
      res.json({
        avatar:
          response.data.teams.length > 0
            ? response.data.teams[0].encodedAvatar
            : "",
      })
    )
    .catch(function (error) {
      console.log(error);
    });
}
