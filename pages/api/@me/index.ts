import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from "@/lib/db";

export default async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(req, res, authOptions)) as Session;

  if (!session) res.status(400).send("You are not logged in!");

  const me = await db.user.findUnique({
    where: {
      // @ts-ignore
      id: session.user?.id,
    },
  });

  res.status(200).send(me);
}
