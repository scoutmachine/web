import { tbaAxios, TBAEvent, TBATeam } from "@/lib/fetchTBA";
import { RouterBuilder } from "next-api-handler";
import db from "@/lib/db";
import _ from "lodash";
import { Team, Event, Prisma } from "@prisma/client";
import { CURR_YEAR } from "@/lib/constants";

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
        school_name: null,
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

const handleEventsETL = async () => {
  console.log("Starting Events ETL");

  const startYear = 1992;

  let numEventsInserted = 0;

  for (let year = startYear; year <= CURR_YEAR; year++) {
    console.log(`Parsing Events for ${year}`);
    const eventsRequest = await tbaAxios.get<TBAEvent[]>(`/events/${year}`);
    console.log(`Found ${eventsRequest.data.length} Events for ${year}`);

    const data = eventsRequest.data.map((event): Event => {
      return {
        key: event.key,
        name: event.name,
        short_name: event.short_name ?? null,
        event_type: event.event_type,
        event_type_string: event.event_type_string,
        // district: event.district?.display_name ?? null,
        city: event.city ?? null,
        state_prov: event.state_prov ?? null,
        country: event.country ?? null,
        start_date: event.start_date,
        end_date: event.end_date,
        year: event.year,
        website: event.website ?? null,
        postal_code: event.postal_code ?? null,
        lat: event.lat ?? null,
        lng: event.lng ?? null,
        location_name: event.location_name ?? null,
        gmaps_place_id: event.gmaps_place_id ?? null,
        gmaps_url: event.gmaps_url ?? null,
        timezone: event.timezone ?? null,
        week: event.week ?? null,
        parent_event_key: event.parent_event_key ?? null,
        playoff_type: event.playoff_type ?? null,
        playoff_type_string: event.playoff_type_string ?? null,
        first_event_id: event.first_event_id ?? null,
        first_event_code: event.first_event_code ?? null,
        division_keys: event.divison_keys ?? [],
        address: event.address ?? null,
        event_code: event.event_code,
        webcasts: (event.webcasts as Prisma.JsonArray) ?? null,
      };
    });

    const result = await db.event.createMany({
      // Not sure why data mismatch
      data: data as any,
      skipDuplicates: true,
    });

    numEventsInserted += result.count;
  }

  console.log("Finished Events ETL");
};

const addTeamsToEvents = async () => {
  console.log("Starting Teams to Events ETL");

  const allEvents = await db.event.findMany({
    select: {
      key: true,
    },
  });

  const eventPromiseArr = allEvents.map((event) => async () => {
    try {
      const participatingTeams = await tbaAxios.get(
        `/event/${event.key}/teams/keys`
      );

      await db.event.update({
        where: {
          key: event.key,
        },
        data: {
          teams: {
            connect: participatingTeams.data.map((teamKey: string) => {
              return {
                team_number: parseInt(teamKey.substring(3)),
              };
            }),
          },
        },
      });

      return event.key;
    } catch (error) {
      console.log("Error adding teams to event: ", event.key);
      console.log(error);
      return undefined;
    }
  });

  // Chunk the promises to avoid overloading the DB
  const chunkedPromises = _.chunk(eventPromiseArr, 50);
  console.log(`Splitting Events into ${chunkedPromises.length} chunks`);

  // loop over chunkedPromises with index
  for (const [index, eventPromise] of chunkedPromises.entries()) {
    const allEvents = await Promise.all(
      eventPromise.map((fn: Function) => fn())
    );
    console.log(
      `Event Chunk: ${index + 1}/${
        chunkedPromises.length
      }. Added the following events: ${allEvents
        .filter((event) => event !== undefined)
        .join(", ")}`
    );
  }

  return true;
};

router.post(async (req, res) => {
  try {
    const teamsInserted = await handleTeamsETL();
    const eventsInserted = await handleEventsETL();
    await addTeamsToEvents();

    res.status(200).json({
      message: "Success",
      teamsInserted,
      eventsInserted,
    });
  } catch (error) {
    console.log("error: ", error);
  }
});

export default router.build();
