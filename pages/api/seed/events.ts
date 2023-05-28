import { tbaAxios, TBAEvent } from "@/lib/fetchTBA";
import {
  NextApiRequestWithMiddleware,
  RouterBuilder,
  TypedObject,
} from "next-api-handler";
import db from "@/lib/db";
import _ from "lodash";
import { Event, Prisma } from "@prisma/client";
import { CURR_YEAR } from "@/lib/constants";
import { AxiosResponse } from "axios";
import { NextApiResponse } from "next";

const router: RouterBuilder = new RouterBuilder();

const handleEventsETL = async (): Promise<number> => {
  console.log("Starting Events ETL");

  const startYear: number = 1992;

  let numEventsInserted: number = 0;

  for (let year: number = startYear; year <= CURR_YEAR; year++) {
    console.log(`Parsing Events for ${year}`);
    const eventsRequest: AxiosResponse<TBAEvent[], any> = await tbaAxios.get<
      TBAEvent[]
    >(`/events/${year}`);
    console.log(`Found ${eventsRequest.data.length} Events for ${year}`);

    const data: Event[] = eventsRequest.data.map((event: TBAEvent): Event => {
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

    const result: Prisma.BatchPayload = await db.event.createMany({
      // Not sure why data mismatch
      data: data as any,
      skipDuplicates: true,
    });

    numEventsInserted += result.count;
  }

  console.log("Finished Events ETL");
  return numEventsInserted;
};

const addTeamsToEvents = async (): Promise<boolean> => {
  console.log("Starting Teams to Events ETL");

  const allEvents: { key: string }[] = await db.event.findMany({
    select: {
      key: true,
    },
  });

  const eventPromiseArr: (() => Promise<string | undefined>)[] = allEvents.map(
    (event: { key: string }) => async (): Promise<string | undefined> => {
      try {
        const participatingTeams: AxiosResponse<any, any> = await tbaAxios.get(
          `/event/${event.key}/teams/keys`
        );
        //   const eventAlliances = await tbaAxios.get(
        //     `/event/${event.key}/alliances`
        //   );
        const eventAwards: AxiosResponse<any, any> = await tbaAxios.get(
          `/event/${event.key}/awards`
        );

        await db.award.createMany({
          data: eventAwards.data,
          skipDuplicates: true,
        });

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
    }
  );

  // Chunk the promises to avoid overloading the DB
  const chunkedPromises: (() => Promise<string | undefined>)[][] = _.chunk(
    eventPromiseArr,
    50
  );
  console.log(`Splitting Events into ${chunkedPromises.length} chunks`);

  // loop over chunkedPromises with index
  for (const [index, eventPromise] of chunkedPromises.entries()) {
    const allEvents: any[] = await Promise.all(
      eventPromise.map((fn: Function) => fn())
    );
    console.log(
      `Event Chunk: ${index + 1}/${
        chunkedPromises.length
      }. Added the following events: ${allEvents
        .filter((event): boolean => event !== undefined)
        .join(", ")}`
    );
  }

  return true;
};

router.post(
  async (
    req: NextApiRequestWithMiddleware<TypedObject>,
    res: NextApiResponse
  ): Promise<void> => {
    try {
      const eventsInserted: number = await handleEventsETL();
      await addTeamsToEvents();

      res.status(200).json({
        message: "Success",
        eventsInserted,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  }
);

export default router.build();
