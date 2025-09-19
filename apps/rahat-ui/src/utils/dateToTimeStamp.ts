export const dateToTimestamp = (dateString: string): string => {
  const date = new Date(dateString);
  return String(Math.floor(date.getTime() / 1000));
};

export const timeStampToDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};
