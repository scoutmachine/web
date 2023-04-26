import { API_URL } from "@/lib/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getTeamsAndAvatars(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const baseFetch = async (pageNum: number) =>
    await fetch(`${API_URL}/api/team/teams?page=${pageNum}`).then((res) =>
      res.json()
    );

  const teams = await baseFetch(
    Math.floor(Math.random() * (18 - 0 + 1) + 0)
  ).then((teams) => teams.slice(0, 50));

  const teamAvatars: any = {};

  const getTeamAvatars = teams.map(async (team: any) => {
    const data = await fetch(
      `${API_URL}/api/team/avatar?team=${team.team_number}`
    ).then((res) => res.json());

    try {
      teamAvatars[team.team_number] = data.avatar;
    } catch (e) {
      console.error(e);
    }
  });

  await Promise.all(getTeamAvatars);

  res.status(200).send({ teams, avatars: teamAvatars });
}
