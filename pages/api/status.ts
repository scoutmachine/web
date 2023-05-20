import { CURR_YEAR } from "@/lib/constants";
import { fetchFIRST } from "@/lib/fetchFIRST";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getStatus(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const data = await fetchFIRST();

    res.status(200).json({
        season: CURR_YEAR,
        data: {
            ...data,
        },
    });
}
