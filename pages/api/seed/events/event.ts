import { tbaAxios } from "@/lib/fetchTBA";
import {
  NextApiRequestWithMiddleware,
  RouterBuilder,
  TypedObject,
} from "next-api-handler";
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { AxiosResponse } from "axios";

const router: RouterBuilder = new RouterBuilder();

const handleEventETL = async (req: NextApiRequest): Promise<void> => {
  const { event } = req.query;

  console.log(`Updating ${event}`);

  const participatingTeams: AxiosResponse<any, any> = await tbaAxios.get(
    `/event/${event}/teams/keys`
  );
  //   const eventAlliances = await tbaAxios.get(
  //     `/event/${event.key}/alliances`
  //   );
  const eventAwards: AxiosResponse<any, any> = await tbaAxios.get(
    `/event/${event}/awards`
  );

  await db.award.createMany({
    data: eventAwards.data,
    skipDuplicates: true,
  });

  await db.event.update({
    where: {
      key: String(event),
    },
    data: {
      teams: {
        connect: participatingTeams.data.map(
          (teamKey: string): { team_number: number } => {
            return {
              team_number: parseInt(teamKey.substring(3)),
            };
          }
        ),
      },
    },
  });

  console.log(`Finished updating ${event}`);
};

router.post(
  async (
    req: NextApiRequestWithMiddleware<TypedObject>,
    res: NextApiResponse
  ): Promise<void> => {
    try {
      await handleEventETL(req);

      res.status(200).json({
        message: "Success",
      });
    } catch (error) {
      console.log("error: ", error);
    }
  }
);

export default router.build();
