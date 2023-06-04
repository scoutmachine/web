import db from "@/lib/db";
import { ApiKey } from ".prisma/client";

// Needs testing but should prevent conflicting keys & all should be 50 chars
export function generateAPIKey(): string {
  const characters: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString: string = "";

  for (let i: number = 0; i < 50; i++) {
    const randomIndex: number = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  let keyValid: boolean = true;
  db.apiKey.findMany().then((keys: ApiKey[]): void => {
    for (const key of keys) {
      if (key.key === randomString) {
        keyValid = false;
      }
    }
  });

  if (keyValid) {
    return randomString;
  } else {
    return generateAPIKey();
  }
}
