export const formatTime = (ms: number): string => {
  const date: Date = new Date(ms);

  return `${date.getMinutes()}mins ${date.getSeconds()}s`;
};

export const epochSecondsToTime = (unixTimestamp: number): string => {
  const date: Date = new Date(unixTimestamp * 1000);
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const ampm: "PM" | "AM" = hours >= 12 ? "PM" : "AM";
  const formattedHours: number = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes: string | number = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const getSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatEpochSecondsToDate = (epochSeconds: number): string => {
  const date: Date = new Date(epochSeconds * 1000);
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month: string = months[date.getMonth()];
  const day: number = date.getDate();
  const suffix: string = getSuffix(day);
  const year: number = date.getFullYear();
  return `${month} ${day}${suffix}, ${year}`;
};
