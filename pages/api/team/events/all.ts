import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamEvents(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const data = await fetchTBA(`team/frc${team}/events`);

  const newData = data.reduce((acc: any[], event: any) => {
    if (!event.name.includes("Cancelled")) {
      acc.push({
        name: event.name,
        event_type_string: event.event_type_string,
        event_code: `${event.year}${event.event_code}`,
      });
    }
    return acc;
  }, []);

  res.status(200).send(newData.reverse());
}
