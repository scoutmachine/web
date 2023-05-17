import { NextApiRequest, NextApiResponse } from "next";
import { fetchFIRST } from "@/lib/fetchFIRST";

export const getTeamAvatar = async (req: NextApiRequest) => {
  const { team } = req.query;
  return await fetchFIRST(`/avatars?teamNumber=${team}`);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const avatar = await getTeamAvatar(req).catch(() => {
    res.status(500).json({ avatar: null })
  });
  if (avatar!.status < 200 || avatar!.status >= 300) {
    return res.status(avatar!.status).send("API request failed");
  }

  res.status(200).json({
    avatar:
      avatar!.data.teams.length > 0
        ? avatar!.data.teams[0].encodedAvatar
        : null,
  });
};
