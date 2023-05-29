import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

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

  if (!session.user.admin) res.status(200).send("You can't run this action!");

  switch (table) {
    case "events":
      res.status(200).send("Successfully deleted Events");
      await db.event.deleteMany();
      break;

    case "matches":
      res.status(200).send("Successfully deleted Matches");
      await db.match.deleteMany();
      break;

    case "awards":
      res.status(200).send("Successfully deleted Awards");
      await db.award.deleteMany();
      break;

    case "teams":
      res.status(200).send("Successfully deleted Teams");
      await db.team.deleteMany();
      break;

    default:
      res
        .status(200)
        .send("Successfully deleted teams, matches, events, & award tables");
      await db.team.deleteMany();
      await db.match.deleteMany();
      await db.event.deleteMany();
      await db.award.deleteMany();
  }
}
