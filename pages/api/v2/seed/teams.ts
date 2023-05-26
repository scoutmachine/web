import { tbaAxios, TBATeam } from "@/lib/fetchTBA";
import {
  NextApiRequestWithMiddleware,
  RouterBuilder,
  TypedObject,
} from "next-api-handler";
import db from "@/lib/db";
import { Prisma, Team } from "@prisma/client";
import { AxiosResponse } from "axios";
import Next from "next-auth/src";
import { NextApiResponse } from "next";

const router: RouterBuilder = new RouterBuilder();

const handleTeamsETL = async (): Promise<number> => {
  console.log("Starting Teams ETL");

  let numTeamsInserted: number = 0;
  let pageNum: number = 0;
  while (true) {
    const teamsRequest: AxiosResponse<TBATeam[], any> = await tbaAxios.get<
      TBATeam[]
    >(`/teams/${pageNum}`);
    if (teamsRequest.data.length === 0) {
      break;
    }
    console.log(
      `Parsing Teams page ${pageNum++}. Found ${
        teamsRequest.data.length
      } Teams. [${teamsRequest.data[0].team_number}/${
        teamsRequest.data[teamsRequest.data.length - 1].team_number
      }]`
    );

    const data: Team[] = teamsRequest.data.map((team: TBATeam): Team => {
      return {
        team_number: team.team_number,
        city: team.city ?? null,
        country: team.country ?? null,
        nickname: team.nickname ?? null,
        website: team.website ?? null,
        state_prov: team.state_prov ?? null,
        rookie_year: team.rookie_year ?? null,
        name: team.name,
        address: team.address ?? null,
        postal_code: team.postal_code ?? null,
        lat: team.lat ?? null,
        lng: team.lng ?? null,
        location_name: team.location_name ?? null,
        gmaps_place_id: team.gmaps_place_id ?? null,
        gmaps_url: team.gmaps_url ?? null,
        motto: team.motto ?? null,
        key: team.key,
        school_name: team.school_name ?? null,
      };
    });

    const result: Prisma.BatchPayload = await db.team.createMany({
      data,
      skipDuplicates: true,
    });

    numTeamsInserted += result.count;
  }

  console.log("Finished Teams ETL");
  return numTeamsInserted;
};

router.post(
  async (
    req: NextApiRequestWithMiddleware<TypedObject>,
    res: NextApiResponse
  ): Promise<void> => {
    try {
      const teamsInserted: number = await handleTeamsETL();

      res.status(200).json({
        message: "Success",
        teamsInserted,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  }
);

export default router.build();
