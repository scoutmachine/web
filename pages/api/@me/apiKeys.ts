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
        // @ts-ignore
        userId: session.user.id,
      },
    });

    return res.status(200).json({ apiKey: apiKey.key });
  } else if (req.method === "DELETE") {
    const { apiKeyId } = req.body;
    if (!apiKeyId) {
      return res.status(400).json({ message: "Missing API key ID" });
    }

    const apiKey = await db.apiKey.findUnique({
      // @ts-ignore
      where: { id: Number(apiKeyId) },
    });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }
    // @ts-ignore
    await db.apiKey.delete({ where: { id: Number(apiKeyId) } });

    return res.status(200).json({ message: "API key deleted" });
  }
}
