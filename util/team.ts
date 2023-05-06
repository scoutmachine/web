import { HOFTeams } from "@/lib/constants";

export const findTeam = (teamName: string): any => {
  for (const team of HOFTeams) {
    if ((team as any).name === teamName) {
      return team;
    }
  }
  return false;
};

export const teamNumberInRange = (teamNumber: number, teamNumberRange: string): boolean => {
  if (!teamNumberRange) {
    return true;
  }

  const [start, end] = teamNumberRange.split("-");
  return teamNumber >= parseInt(start) && teamNumber <= parseInt(end);
}
