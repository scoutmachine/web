import { NextApiRequest, NextApiResponse } from "next";
import { tbaAxios } from "@/lib/fetchTBA";
import db from "@/lib/db";
import { Match, Prisma } from "@prisma/client";
import {AxiosResponse} from "axios";

export default async function getDistricts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { event } = req.query;
  const eventData: AxiosResponse<any, any> = await tbaAxios.get(`/event/${event}`);
  const matches: AxiosResponse<any, any> = await tbaAxios.get(`/event/${event}/matches`);

  const formattedMatchesData = matches.data.map((match: Match) => {
    return {
      key: match.key ?? null,
      comp_level: match.comp_level ?? null,
      set_number: match.set_number ?? null,
      match_number: match.match_number ?? null,
      alliances: match.alliances ?? null,
      winning_alliance: match.winning_alliance ?? null,
      event_key: match.event_key ?? null,
      time: match.time ?? null,
      actual_time: match.actual_time ?? null,
      predicted_time: match.predicted_time ?? null,
      post_result_time: match.post_result_time ?? null,
      score_breakdown: match.score_breakdown ?? Prisma.DbNull,
      videos: match.videos ?? null,
    };
  });

  const existingMatches: Match[] = await db.match.findMany({
    where: { key: String(event) },
  });

  const existingMatchKeys: Set<string | null> = new Set(existingMatches.map((match: Match) => match.key));
  const newMatches = formattedMatchesData.filter(
    (match: any) => !existingMatchKeys.has(match.key)
  );

  const updatePromises: (Prisma.Prisma__MatchClient<Match> | undefined)[] = existingMatches.map((existingMatch: Match) => {
    const newMatchData = formattedMatchesData.find(
      (match: any): boolean => match.key === existingMatch.key
    );
    if (newMatchData) {
      return db.match.update({
        where: { id: existingMatch.id },
        data: newMatchData,
      });
    }
  });

  await Promise.all(updatePromises);

  if (newMatches.length > 0) {
    await db.match.createMany({
      data: newMatches,
      skipDuplicates: true,
    });
  }

  res.status(200).json({
    status: "Success",
    event: eventData.data,
  });
}
