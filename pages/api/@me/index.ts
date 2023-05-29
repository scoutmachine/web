import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from "@/lib/db";

export default async function getUserData(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  if (!session) res.status(400).send("You are not logged in!");

  if (req.method === "GET") {
    const me: User | null = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    res.status(200).send(me);
  }

  if (req.method === "DELETE") {
    await db.user.delete({
      where: {
        id: session.user?.id,
      },
    });

    res.status(200).send("Deleted account successfully");
  }
}
