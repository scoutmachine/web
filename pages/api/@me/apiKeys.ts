import db from "@/lib/db";
import { generateRandomString } from "@/utils/generateRandomString";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  if (!session) res.status(400).send("You are not logged in!");

  if (req.method === "POST") {
    const key = generateRandomString(32);
    const apiKey = await db.apiKey.create({
      data: {
        key: key,
        userId: session.user.id,
      },
    });

    return res.status(200).json({ apiKey: apiKey.key });
  }

  if (req.method === "DELETE") {
    const { apiKey } = req.query;

    try {
      await db.apiKey.delete({
        where: { key: apiKey as string },
      });

      res.status(200).json({ message: "API key deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete API key" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
