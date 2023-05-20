import { API_URL, CURR_YEAR } from "@/lib/constants";
import { getStorage, setStorage } from "./localStorage";
import { log } from "./log";
import { formatTime } from "./time";
import { HOFTeams } from "@/lib/lists/hallOfFame";

export const findTeam = (teamName: string): any => {
  for (const team of HOFTeams) {
    if ((team as any).name === teamName) {
      return team;
    }
  }
  return false;
};

export const teamNumberInRange = (
  teamNumber: number,
  teamNumberRange: string
): boolean => {
  if (!teamNumberRange) {
    return true;
  }

  const [start, end] = teamNumberRange.split("-");
  return teamNumber >= parseInt(start) && teamNumber <= parseInt(end);
};

export async function fetchTeamsData(): Promise<any> {
  const teamsData = getStorage(`teams_${CURR_YEAR}`);
  if (teamsData) return teamsData;

  const start: number = performance.now();
  const getTeams = async (pageNum: string): Promise<any> =>
      await fetch(`${API_URL}/api/team/teams?page=${pageNum}`, {
        next: {revalidate: 60},
      }).then((res: Response) => res.json());
  const pageNumbers: string[] = [...Array(20).keys()].map((i: number) => i.toString());
  const pages: any[] = await Promise.all(pageNumbers.map((num: string) => getTeams(num)));
  const teams: any = pages.flatMap((page: any) => page);

  log(
      "warning",
      `Fetching [/team/teams] took ${formatTime(performance.now() - start)}`
  );

  setStorage(`teams_${CURR_YEAR}`, teams, 60 * 60 * 24 * 7 * 4); // 4 weeks (28 days)
  return teams;
}
