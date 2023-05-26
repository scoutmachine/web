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
      .events();

    const teamMembers: User[] = await db.user.findMany({
      where: {
        teamNumber: Number(team),
      },
    });

    const yearsParticipated: any = [];

    teamEvents.map((event: any) => {
      const year = event.year;
      if (yearsParticipated.indexOf(year) === -1) yearsParticipated.push(year);
    });

    res.status(200).json({
      teamInfo,
      teamAwards,
      teamEvents,
      yearsParticipated,
      teamMembers: JSON.parse(JSON.stringify(teamMembers)),
      teamSocials,
    });
  }
}
