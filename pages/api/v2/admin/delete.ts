import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { table } = req.query;
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;

  // @ts-ignore
  if (!session.user.admin) res.status(200).send("You can't run this action!");

  switch (table) {
    case "events":
      res.status(200).send("Successfully deleted Events");
      await db.event.deleteMany();

    case "matches":
      res.status(200).send("Successfully deleted Matches");
      await db.match.deleteMany();

    case "teams":
      res.status(200).send("Successfully deleted Teams");
      await db.team.deleteMany();
  }
}
