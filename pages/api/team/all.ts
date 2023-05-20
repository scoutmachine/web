import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { fetchTeamAvatar } from "./avatar";
import { API_URL } from "@/lib/constants";

export default async function getAllTeamInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { team } = req.query;

    const [
      teamData,
      teamAvatar,
      teamSocials,
      yearsParticipated,
      teamDistrict,
      teamEvents,
    ] = await Promise.all([
      fetchTBA(`team/frc${team}`),
      fetchTeamAvatar(req),
      fetchTBA(`team/frc${team}/social_media`),
      fetchTBA(`team/frc${team}/years_participated`),
      fetch(`${API_URL}/api/team/stats?team=${team}`, {
        next: { revalidate: 60 },
      }).then((res) => res.json()),
      fetch(`${API_URL}/api/team/events/all?team=${team}`, {
        next: { revalidate: 60 },
      }).then((res) => res.json()),
    ]);

    const teamAwardsResponse = await fetch(
      `${API_URL}/api/team/awards?team=${team}&year=${yearsParticipated[0]}`,
      {
        next: { revalidate: 60 },
      }
    );
    const teamAwards = await teamAwardsResponse.json();

    res.status(200).json({
      teamData,
      teamAvatar: teamAvatar.avatar,
      teamSocials,
      teamAwards,
      yearsParticipated,
      teamDistrict,
      teamEvents,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
