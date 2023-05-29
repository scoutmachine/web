import { User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: ScoutMachineUser;
  }

  interface ScoutMachineUser extends User {
    username: string;
    admin: boolean;
    teamNumber: number | string | null | undefined;
  }
}
