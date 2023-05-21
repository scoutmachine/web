import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { Session, getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { FavouritedTeam } from "@prisma/client";

export default async function getUserFavourites(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session: Session = (await getServerSession(
    req,
    res,
    authOptions
  )) as Session;
  const { id } = req.query;

  if (!session) {
    res.status(400).send("You are not logged in.");
  } else {
    if (req.method === "GET") {
      const data: (User & { favouritedTeams: FavouritedTeam[] }) | null =
        await db.user.findUnique({
          where: {
            // @ts-ignore
            id: session?.user?.id,
          },
          include: {
            favouritedTeams: true,
          },
        });

      res.status(200).send(data);
    }

    if (req.method === "POST") {
      if (req.body) {
        const body = JSON.parse(req.body);
        const data: FavouritedTeam = await db.favouritedTeam.create({
          data: {
            // @ts-ignore
            userId: session?.user.id,
            team_number: body.team_number,
            nickname: body.nickname,
            city: body.city,
            state_prov: body.state_prov,
            country: body.country,
            website: body.website ?? "",
            rookie_year: body.rookie_year,
          },
        });

        if (data) {
          res.status(200).send("Success");
        } else {
          res.status(400).send("Error while favouriting team");
        }
      } else {
        res.status(400).send("Invalid body");
      }
    }

    if (req.method === "DELETE") {
      const data: FavouritedTeam = await db.favouritedTeam.delete({
        where: {
          id: Number(id),
        },
      });

      if (data) {
        res.status(200).send("Successfully unfavourited team");
      } else {
        res.status(400).send("Unable to unfavourite team");
      }
    }
  }
}
