import { NextApiRequest, NextApiResponse } from "next";
import { fetchTeamAvatar } from "../teams/avatar";
import fs from "fs";
import path from "path";

export default async function getStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const fetchAvatar:
    | { avatar: null; status: any }
    | { avatar: any; status: any }
    | { avatar: null; status: number } = await fetchTeamAvatar(req);
  const avatar = fetchAvatar.avatar;

  if (!avatar) {
    const imagePath = path.join(process.cwd(), "public", "first-icon.svg");

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).end();
        return;
      }

      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week
      res.end(data);
    });

    return;
  }

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week

  res.end(Buffer.from(avatar, "base64"));
}
