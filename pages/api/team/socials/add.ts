import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import db from "@/lib/db";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function addSocials(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(req, res, authOptions)) as Session;
  const { team } = req.query;
  //   const tbaSocials = await fetchTBA(`team/frc${team}/social_media`);

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
        body.map(async (social: any) => {
          await db.social.create({
            data: {
              type: social.type,
              handle: social.handle,
              teamId: Number(team),
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
        body.map(async (social: any) => {
          await db.social.create({
            data: {
              type: social.type,
              handle: social.handle,
              teamId: Number(team),
            },
          });
        })
      );
    }

    res.status(200).send("Successfully created social");
  }

  //   if (req.method === "GET") {
  //     const data = await db.team.findMany({
  //       where: {
  //         team_number: Number(team),
  //       },
  //       include: {
  //         socials: true,
  //       },
  //     });

  //     const newFormattedTBASocials = tbaSocials.map((social: any) => ({
  //       type: social.type.replace("-profile", "").replace("-channel", ""),
  //       handle: social.foreign_key,
  //     }));

  //     const allSocials = data.flatMap((team) =>
  //       team.socials.map((social: any) => ({
  //         type: social.type,
  //         handle: social.handle,
  //         verified: social.verified,
  //       }))
  //     );

  //     res
  //       .status(200)
  //       .send({ socials: [...allSocials, ...newFormattedTBASocials] });
  //   }
}
