import { NextApiRequest, NextApiResponse } from "next";

export default async function getMatchEPA(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
  const {match} = req.query;

  if (!match) {
    res.status(400).send("No match code provided");
    return;
  }

  const matchCodeRegex: RegExp = /^[A-Za-z0-9_-]+$/;
  if (!matchCodeRegex.test(String(match))) {
    res.status(400).send("Invalid match code");
    return;
  }

  try {
    const data = await fetch(
      `https://api.statbotics.io/v2/match/${match}`
    ).then((res: Response) => res.json());
    res.status(200).send({
      redEPA: data.red_epa_sum,
      blueEPA: data.blue_epa_sum,
    });
  } catch (error) {
    res.status(500).send("An error occurred");
  }
}
