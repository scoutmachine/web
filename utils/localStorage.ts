import { log } from "./log";

export const setStorage = (key: string, value: string, ttl?: number) => {
  const now = new Date();

  const item = {
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
};

export const getStorage = (key: string) => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const data = JSON.parse(item);
  const now = new Date();

  if (!data.expiry || now.getTime() > data.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return data.value;
};
