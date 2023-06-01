import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { CURR_YEAR } from "@/lib/constants";
import {Match, Team} from "@prisma/client";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team, year = CURR_YEAR } = req.query;

  const teamInfo: Team | null = await db.team.findUnique({
    where: {
      team_number: Number(team),
    },
  });

  if (teamInfo) {
    const teamEvents: any = await db.team
      .findUnique({
        where: {
          team_number: Number(team),
        },
      })
      .events({
        where: {
          year: Number(year),
        },
        orderBy: {
          year: "desc",
        },
      });

    let eventMatches: any[] = [];

    for (const event of teamEvents) {
      const eventWithMatches: Match[] = await db.match.findMany({
        where: {
          OR: [
            {
              event_key: event.key,
              alliances: {
                path: ["red", "team_keys"],
                array_contains: `frc${team}`,
              },
            },
            {
              event_key: event.key,
              alliances: {
                path: ["blue", "team_keys"],
                array_contains: `frc${team}`,
              },
            },
          ],
        },
      });

      if (eventWithMatches) eventMatches.push(...eventWithMatches);
    }

    res.status(200).json({
      teamEvents,
      eventMatches: JSON.parse(
        JSON.stringify(
          eventMatches,
          (key: string, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
        )
      ),
    });
  }
}
