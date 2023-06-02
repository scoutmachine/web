import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { fetchTeamAvatar } from "../teams/avatar";

export default async function getStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const fetchAvatar = await fetchTeamAvatar(req);
  const avatar = fetchAvatar.avatar;

  res.setHeader('Content-Type', 'image/jpeg');
  res.end(Buffer.from(avatar, 'base64'));
}
