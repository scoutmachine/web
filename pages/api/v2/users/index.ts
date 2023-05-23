import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { user } = req.query;

  const fetchUser = await db.user.findUnique({
    where: {
      username: String(user),
    },
  });

  res.status(200).send(fetchUser);
}
