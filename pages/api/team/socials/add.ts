import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import db from "@/lib/db";

export default async function addSocials(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(req, res, authOptions)) as Session;
  const { team } = req.query;
  if (!session) res.status(400).send("You are not logged in!");

  if (req.method === "POST") {
    const body = JSON.parse(req.body);

    body.forEach(async (social: any) => {
      await db.social.create({
        data: {
          type: social.type,
          handle: social.handle,
          team_number: Number(team),
        },
      });
    });

    res.status(200).send("Successfully created social");
  }

  if (req.method === "GET") {
    const data = await db.social.findMany({
      where: {
        team_number: Number(team),
      },
    });

    res.status(200).send(data);
  }
}
