export function formatTime(ms: number): string {
  const date: Date = new Date(ms);

  return `${date.getMinutes()}mins ${date.getSeconds()}s`;
}

export function epochSecondsToTime(
  epochSeconds: number,
  noMultiply?: boolean
): string {
  const date: Date = new Date(noMultiply ? epochSeconds : epochSeconds * 1000);
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const ampm: "PM" | "AM" = hours >= 12 ? "PM" : "AM";
  const formattedHours: number = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes: string | number =
    minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

function getSuffix(day: number): string {
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
}

export function formatEpochSecondsToDate(
  epochSeconds: number,
  noMultiply?: boolean
): string {
  const date: Date = new Date(noMultiply ? epochSeconds : epochSeconds * 1000);

  const days: string[] = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

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
  const dayOfWeek: string = days[date.getDay()];
  const suffix: string = getSuffix(day);
  const year: number = date.getFullYear();
  return `${dayOfWeek}, ${month} ${day}${suffix}, ${year}`;
}

export function formatRelativeTime(timestamp: string): string {
  const currentTime: Date = new Date();
  const targetTime: Date = new Date(timestamp);

  const timeDifference: number = currentTime.getTime() - targetTime.getTime();
  const daysDifference: number = Math.floor(
    timeDifference / (1000 * 3600 * 24)
  );
  const secondsDifference: number = Math.floor(timeDifference / 1000);

  if (daysDifference > 0) {
    if (daysDifference === 1) {
      return "1 day ago";
    } else {
      return `${daysDifference} days ago`;
    }
  } else if (secondsDifference >= 3600) {
    const hoursDifference: number = Math.floor(secondsDifference / 3600);
    if (hoursDifference === 1) {
      return "1 hour ago";
    } else {
      return `${hoursDifference} hours ago`;
    }
  } else if (secondsDifference >= 60) {
    const minutesDifference: number = Math.floor(secondsDifference / 60);
    if (minutesDifference === 1) {
      return "1 minute ago";
    } else {
      return `${minutesDifference} minutes ago`;
    }
  } else {
    return "Just now";
  }
}
