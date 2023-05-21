import { NextApiRequest, NextApiResponse } from "next";
import { fetchTBA } from "@/lib/fetchTBA";
import { AxiosResponse } from "axios";
import { CURR_YEAR } from "@/lib/constants";
import { fetchFIRST } from "@/lib/fetchFIRST";

export default async function getTeamInfo(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { team } = req.query;
  const events: any | void | AxiosResponse<any, any> = await fetchTBA(
    `team/frc${team}/events/${CURR_YEAR}`
  );
  const currentEvent = events[0];
  const schedule: any | void | AxiosResponse<any, any> = await fetchFIRST(
    `/schedule/${currentEvent.first_event_code}?teamNumber=${team}`
  );
  const lastMatch = schedule.Schedule[schedule.Schedule.length - 1];

  res
    .status(200)
    .json({
      event: currentEvent,
      match: schedule.Schedule[0],
      previous: lastMatch,
    });
}
