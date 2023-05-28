import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { AxiosResponse } from "axios";
import { CURR_YEAR } from "@/lib/constants";
import { fetchFIRST } from "@/lib/fetchFIRST";
import db from "@/lib/db";

export default async function getTeamInfo(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const teamEvents = await db.team.findUnique({
    where: { team_number: Number(team) },
    include: {
      events: {
        where: { year: CURR_YEAR },
      },
    },
  });
  const events = teamEvents?.events;

  const currentEvent = events
    ?.filter((event: any): boolean => {
      const eventDate: Date = new Date(event.start_date || event.end_date);
      return eventDate <= new Date();
    })
    .sort((a: any, b: any) => {
      const aDate: Date = new Date(a.start_date || a.end_date);
      const bDate: Date = new Date(b.start_date || b.end_date);
      return bDate.getTime() - aDate.getTime();
    })[0];

  const schedule: any | void | AxiosResponse<any, any> = await fetchFIRST(
    `/schedule/${currentEvent?.first_event_code}?teamNumber=${team}`
  );

  const lastMatch = schedule.Schedule.sort((a: any, b: any) => {
    const aDate: Date = new Date(a.startTime);
    const bDate: Date = new Date(b.startTime);
    return bDate.getTime() - aDate.getTime();
  });

  res.status(200).json({
    event: {
      city: currentEvent?.city,
      country: currentEvent?.country,
      state_prov: currentEvent?.state_prov,
      name: currentEvent?.name,
      location_name: currentEvent?.location_name,
      webcasts: currentEvent?.webcasts,
    },
    match: lastMatch[0] ?? null,
    previous: lastMatch[1] ? { description: lastMatch[1].description } : null,
  });
}
