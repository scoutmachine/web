import { log } from "./log";

export function setStorage(key: string, value: string, ttl?: number): void {
  const now: Date = new Date();

  const item: { value: string; expiry: number } = {
    value: value,
    expiry: now.getTime() + 1000 * Number(ttl ?? 60 * 60), // 1 hour,
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e: any) {
    log("error", `Failed while setting localStorage Item: [${e}]`);

    if (e.name === "QuotaExceededError") {
      localStorage.clear();
    }
  }
}

export function getStorage(key: string): null | any {
  const item: string | null = localStorage.getItem(key);
  if (!item) return null;

  const data = JSON.parse(item);
  const now: Date = new Date();

  if (!data.expiry || now.getTime() > data.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return data.value;
}
