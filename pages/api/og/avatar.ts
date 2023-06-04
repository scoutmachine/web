import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { fetchTeamAvatar } from "../teams/avatar";

export default async function getStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const fetchAvatar:
    | { avatar: null; status: any }
    | { avatar: any; status: any }
    | { avatar: null; status: number } = await fetchTeamAvatar(req);
  const avatar = fetchAvatar.avatar;

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week

  res.end(Buffer.from(avatar, "base64"));
}
