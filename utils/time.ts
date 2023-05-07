export const formatTime = (ms: number) => {
  const date = new Date(ms);

  return `${date.getMinutes()}mins ${date.getSeconds()}s`;
};
