import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from "@/lib/db";

export default async function addSocials(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session: Session = (await getServerSession(req, res, authOptions)) as Session;
  const {team} = req.query;

  if (!session) res.status(400).send("You are not logged in!");

  if (req.method === "POST") {
    const body = req.body;

    const teamExists = await db.team.findUnique({
      where: {
        team_number: Number(team),
      },
    });

    if (teamExists) {
      await Promise.all(
          body.map(async (social: any): Promise<void> => {
            await db.social.create({
              data: {
                type: social.type,
                handle: social.handle,
                teamId: Number(team),
                // @ts-ignore
                userId: session.user?.id,
              },
            });
          })
      );
    } else {
      await db.team.create({
        data: {
          team_number: Number(team),
        },
      });

      await Promise.all(
        body.map(async (social: any): Promise<void> => {
          await db.social.create({
            data: {
              type: social.type,
              handle: social.handle,
              teamId: Number(team),
              // @ts-ignore
              userId: session.user?.id,
            },
          });
        })
      );
    }

    res.status(200).send("Successfully created social");
  }
}
