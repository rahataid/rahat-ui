export const getStatusBg = (status: string) => {
  if (status === 'NOT_STARTED') {
    return 'bg-red-200';
  }

  if (status === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }

  if (status === 'COMPLETED') {
    return 'bg-green-200';
  }

  if (status === 'DELAYED') {
    return 'bg-gray-200';
  }

  return '';
};
