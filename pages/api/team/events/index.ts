import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getTeamEvents(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const {team, year} = req.query;
    const data = await fetchTBA(`team/frc${team}/events/${year}`);

    res.status(200).send(data);
}
