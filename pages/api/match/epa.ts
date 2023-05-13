import { NextApiRequest, NextApiResponse } from "next";

export default async function getMatchEPA(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { match } = req.query;
  const data = await fetch(`https://api.statbotics.io/v2/match/${match}`).then(
    (res) => res.json()
  );
  res.status(200).send({
    redEPA: data.red_epa_sum,
    blueEPA: data.blue_epa_sum,
  });
}
