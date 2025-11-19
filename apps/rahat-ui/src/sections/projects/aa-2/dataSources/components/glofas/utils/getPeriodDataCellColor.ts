export const getCellColor = (cell: string) => {
  const cellValue = cell ? Number(cell) : 0;
  if (cellValue >= 30 && cellValue < 50) {
    return 'bg-yellow-100';
  }
  if (cellValue >= 50 && cellValue < 70) {
    return 'bg-yellow-200';
  }
  if (cellValue >= 70) {
    return 'bg-yellow-300';
  }
  return 'bg-green-50';
};
