import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "next-auth";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { user } = req.query;

  const fetchUser: User | null = await db.user.findUnique({
    where: {
      username: String(user),
    },
  });

  res.status(200).send(fetchUser);
}
