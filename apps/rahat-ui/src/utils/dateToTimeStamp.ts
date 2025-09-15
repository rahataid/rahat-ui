
export const dateToTimestamp = (dateString: string): number => {
  const date = new Date(dateString);
  return (date.getTime() / 1000);
}

export const timeStampToDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
}