import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { fetchTeamAvatar } from "./avatar";
import { API_URL } from "@/lib/constants";

export default async function getAllTeamInfo(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { team } = req.query;

    const [
      teamData,
      teamAvatar,
      rawYearsParticipated,
      teamDistrict,
      teamEvents,
    ] = await Promise.all([
      fetchTBA(`team/frc${team}`),
      fetchTeamAvatar(req),
      fetchTBA(`team/frc${team}/years_participated`),
      fetch(`${API_URL}/api/team/stats?team=${team}`, {
        next: { revalidate: 60 },
      }).then((res: Response) => res.json()),
      fetch(`${API_URL}/api/team/events/all?team=${team}`, {
        next: { revalidate: 60 },
      }).then((res: Response) => res.json()),
    ]);

    const yearsParticipated = rawYearsParticipated.reverse();

    // @ts-ignore
    const teamAwards: Response = await fetch(
      `${API_URL}/api/team/awards?team=${team}&year=${
        rawYearsParticipated[rawYearsParticipated.length - 1]
      }`,
      {
        next: { revalidate: 60 },
      }
    ).then((res) => res.json());

    // @ts-ignore
    res.status(200).json({
      teamData: {
        city: teamData.city,
        country: teamData.country,
        nickname: teamData.nickname,
        website: teamData.website,
        team_number: teamData.team_number,
        state_prov: teamData.state_prov,
        school_name: teamData.school_name,
        rookie_year: teamData.rookie_year,
        name: teamData.name,
      },
      teamAvatar: teamAvatar.avatar,
      yearsParticipated,
      teamAwards,
      teamDistrict,
      teamEvents,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
