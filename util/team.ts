import { HOFTeams } from "@/lib/constants";

export const findTeam = (teamName: string): any => {
  for (const team of HOFTeams) {
    if ((team as any).name === teamName) {
      return team;
    }
  }
  return false;
};
