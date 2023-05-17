import { NextApiRequest, NextApiResponse } from "next";
import { fetchFIRST } from "@/lib/fetchFIRST";

export const getTeamAvatar = async (req: NextApiRequest) => {
  try {
    const { team } = req.query;
    const response = await fetchFIRST(`/avatars?teamNumber=${team}`);
    if (response.status < 200 || response.status >= 300) {
      return { avatar: null, status: response.status };
    }
    return {
      avatar:
        response.data.teams.length > 0
          ? response.data.teams[0].encodedAvatar
          : null,
      status: response.status
    }

  } catch (e) {
    return { avatar: null, status: 500 }
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const avatar = await getTeamAvatar(req);
  res.status(avatar.status).json(avatar);
};
