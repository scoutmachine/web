import { tbaAxios, TBATeam } from "@/lib/fetchTBA";
import { RouterBuilder } from "next-api-handler";
import db from "@/lib/db";
import { Team } from "@prisma/client";

const router = new RouterBuilder();

const handleTeamsETL = async () => {
  console.log("Starting Teams ETL");

  let numTeamsInserted = 0;
  let pageNum = 0;
  while (true) {
    const teamsRequest = await tbaAxios.get<TBATeam[]>(`/teams/${pageNum}`);
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

    const data = teamsRequest.data.map((team): Team => {
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

    const result = await db.team.createMany({
      data,
      skipDuplicates: true,
    });

    numTeamsInserted += result.count;
  }

  console.log("Finished Teams ETL");
  return numTeamsInserted;
};

router.post(async (req, res) => {
  try {
    const teamsInserted = await handleTeamsETL();

    res.status(200).json({
      message: "Success",
      teamsInserted,
    });
  } catch (error) {
    console.log("error: ", error);
  }
});

export default router.build();
