import { NextApiRequest, NextApiResponse } from "next";
import { fetchTeamAvatar } from "../teams/avatar";
import fs from "fs";
import path from "path";
import axios from "axios";

const sendFIRSTImage = (res: NextApiResponse) => {
  const imagePath: string = path.join(
    process.cwd(),
    "public",
    "first-icon.svg"
  );

  fs.readFile(
    imagePath,
    (err: NodeJS.ErrnoException | null, data: Buffer): void => {
      if (err) {
        console.error(err);
        res.status(500).end();
        return;
      }

      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week
      res.end(data);
      return;
    }
  );
};

export default async function getStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const fetchAvatar:
    | { avatar: null; status: any }
    | { avatar: any; status: any }
    | { avatar: null; status: number } = await fetchTeamAvatar(req);
  const avatar = fetchAvatar.avatar;
  const { website } = req.query;

  if (!avatar) {
    if (!website) return sendFIRSTImage(res);

    const getWebsiteFavicon = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
      String(website)?.startsWith("https")
        ? website
        : `https://${website?.slice(7)}`
    }/&size=64`;

    try {
      const response = await axios
        .get(getWebsiteFavicon, {
          responseType: "arraybuffer",
        })
        .then((response) =>
          Buffer.from(response.data, "binary").toString("base64")
        );

      if (response) {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=604800");
        res.end(Buffer.from(response, "base64"));
        return;
      } else {
        return sendFIRSTImage(res);
      }
    } catch {
      return sendFIRSTImage(res);
    }
  }

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week

  res.end(Buffer.from(avatar, "base64"));
}
