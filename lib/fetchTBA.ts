import { log } from "@/utils/log";
import axios, { AxiosResponse } from "axios";

export const tbaAxios = axios.create({
  baseURL: "https://www.thebluealliance.com/api/v3/",
  headers: {
    "X-TBA-Auth-Key": process.env.BLUE_ALLIANCE_API_KEY,
  },
});

export const fetchTBA = async (
  route: string
): Promise<AxiosResponse<any> | void> => {
  if (!process.env.BLUE_ALLIANCE_API_KEY)
    log("error", "BLUE_ALLIANCE_API_KEY not provided");

  return await axios
    .get(`https://www.thebluealliance.com/api/v3/${route}`, {
      headers: {
        "X-TBA-Auth-Key": process.env.BLUE_ALLIANCE_API_KEY,
      },
    })
    .then((response: AxiosResponse<any, any>) => response.data)
    .catch((error) => log("error", error));
};

export type TBATeam = {
	key: string
	team_number: number
	nickname?: string
	name: string
	city?: string
	state_prov?: string
	country?: string
	address?: string
	postal_code?: string
	gmaps_place_id?: string
	gmaps_url?: string
	lat?: number
	lng?: number
	location_name?: string
	website?: string
	rookie_year?: number
	motto?: string
}

export type TBAEvent = {
	key: string
	name: string
	event_code: string
	event_type: number
	// district?: 
	city?: string
	state_prov?: string
	country?: string
	start_date: string
	end_date: string
	year: number
	short_name?: string
	event_type_string: string
	week?: number
	address?: string
	postal_code?: string
	gmaps_place_id?: string
	gmaps_url?: string
	lat?: number
	lng?: number
	location_name?: string
	timezone?: string
	website?: string
	first_event_id?: string
	first_event_code?: string
	webcasts?: {
		channel: string
		type: string
		date?: string
		file?: string
	}[]
	divison_keys?: string[]
	parent_event_key?: string
	playoff_type?: number
	playoff_type_string?: string
}