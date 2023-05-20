import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getEventMatches(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const {event} = req.query;
    const data = await fetchTBA(`event/${event}/matches`);

    res.status(200).send(data);
}
