import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const imagePath: string = path.join(process.cwd(), "public", "smLogo.png");

  fs.readFile(
    imagePath,
    (err: NodeJS.ErrnoException | null, data: Buffer): void => {
      if (err) {
        console.error(err);
        res.status(500).end();
        return;
      }

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week
      res.end(data);
    }
  );
}
