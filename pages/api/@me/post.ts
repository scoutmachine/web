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

  if (req.method === "POST") {
    const body = JSON.parse(req.body);

    const post = await db.post.create({
      data: {
        // @ts-ignore
        authorId: session.user?.id,
        title: body.title,
        content: body.content,
        type: body.type,
        published: false,
        price: Number(body.price),
      },
    });

    res.status(200).send(post);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    await db.post.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).send("Successfully deleted post");
  }

  res.status(400).send("Method not allowed");
}
