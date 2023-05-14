export const formatTime = (ms: number) => {
  const date = new Date(ms);

  return `${date.getMinutes()}mins ${date.getSeconds()}s`;
};

export const epochSecondsToTime = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

const getSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export const formatEpochSecondsToDate = (epochSeconds: number): string => {
  const date = new Date(epochSeconds * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const suffix = getSuffix(day);
  const year = date.getFullYear();
  return `${month} ${day}${suffix}, ${year}`;
}