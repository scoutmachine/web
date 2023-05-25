import { tbaAxios } from "@/lib/fetchTBA";
import { RouterBuilder } from "next-api-handler";
import db from "@/lib/db";

const router = new RouterBuilder();

const handleMatchesETL = async () => {
  console.log("Starting Matches ETL");

  const events = await db.event.findMany();

  for (const event of events) {
    console.log(`Parsing Matches for ${event.key}`);
    const matches: any = await tbaAxios.get(`/event/${event.key}/matches`);

    await db.event.update({
      where: {
        key: event.key,
      },
      data: {
        matches: {
          connect: matches.data,
        },
      },
    });
  }

  console.log("Finished Matches ETL");
};

router.post(async (req, res) => {
  try {
    const matchesInserted = await handleMatchesETL();

    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    console.log("error: ", error);
  }
});

export default router.build();
