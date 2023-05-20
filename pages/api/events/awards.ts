import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";

export default async function getEventAwards(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const {event} = req.query;
    const data = await fetchTBA(`event/${event}/awards`);

    res.status(200).send(data);
}
