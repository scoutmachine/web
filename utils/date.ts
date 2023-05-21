function getDayOrdinal(day: number) {
  const suffixes: string[] = ["th", "st", "nd", "rd"];
  const v: number = day % 100;
  return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export function convertDate(dateParam: string) {
  const date: Date = new Date(dateParam);
  const month: number = date.getUTCMonth();
  const day: number = date.getUTCDate();

  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName: string = months[month];

  const dayOrdinal: string = getDayOrdinal(day);

  const output: string = `${monthName} ${dayOrdinal}`;
  return output;
}

export function isLive(start: string, end: string) {
  const today: Date = new Date();
  const newToday: string = today.toISOString().split("T")[0];

  today.setHours(0, 0, 0, 0);

  return newToday >= start && newToday <= end;
}

export function convertSeconds(epochSeconds: number): string {
  const date: Date = new Date(epochSeconds * 1000);
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const ampm: "PM" | "AM" = hours >= 12 ? "PM" : "AM";
  const formattedHours: number = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes: string | number =
    minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
