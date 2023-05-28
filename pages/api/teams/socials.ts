import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import db from "@/lib/db";
import { tbaAxios } from "@/lib/fetchTBA";
import { Social, Team } from "@prisma/client";
import { AxiosResponse } from "axios";

export default async function addSocials(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;
  const { team } = req.query;

  if (req.method === "POST") {
    if (!session) res.status(400).send("You are not logged in!");
    const body = req.body;

    const teamExists: Team | null = await db.team.findUnique({
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
      // await db.team.create({
      //   data: {
      //     team_number: Number(team),
      //   },
      // });

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

  const tbaSocials: AxiosResponse<any, any> = await tbaAxios(
    `team/frc${team}/social_media`
  );

  const data: (Team & { socials: Social[] })[] = await db.team.findMany({
    where: {
      team_number: Number(team),
    },
    include: {
      socials: true,
    },
  });

  const newFormattedTBASocials = tbaSocials?.data?.map(
    (social: any): { handle: any; type: any } => ({
      type: social.type.replace("-profile", "").replace("-channel", ""),
      handle: social.foreign_key,
    })
  );

  const allSocials: any[] = data.flatMap((team: any) =>
    team.socials
      .filter((social: any) => social.verified)
      .map((social: any) => ({
        type: social.type,
        handle: social.handle,
        verified: social.verified,
      }))
  );

  res.status(200).send([...allSocials, ...newFormattedTBASocials]);
}
