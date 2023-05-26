import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Team, User } from "@prisma/client";
import { API_URL } from "@/lib/constants";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;

  const [teamInfo, teamAwards, teamSocials] = await Promise.all([
    await db.team.findUnique({
      where: {
        team_number: Number(team),
      },
    }),
    await db.award.findMany({
      where: {
        recipient_list: {
          array_contains: [{ awardee: null, team_key: `frc${team}` }],
        },
      },
    }),
    await fetch(`${API_URL}/api/v2/teams/socials?team=${team}`).then((res) =>
      res.json()
    ),
  ]);

  if (teamInfo) {
    const teamEvents: any = await db.team
      .findUnique({
        where: {
          team_number: Number(team),
        },
      })
      .events({
        orderBy: {
          year: "desc",
        },
      });

    let eventMatches: any[] = [];

    for (const event of teamEvents) {
      const eventWithMatches = await db.match.findMany({
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

    const teamMembers: User[] = await db.user.findMany({
      where: {
        teamNumber: Number(team),
      },
    });

    res.status(200).json({
      teamInfo,
      teamEvents,
      teamAwards,
      eventMatches: JSON.parse(
        JSON.stringify(
          eventMatches,
          (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
        )
      ),
      teamMembers: JSON.parse(JSON.stringify(teamMembers)),
      teamSocials,
    });
  }
}
