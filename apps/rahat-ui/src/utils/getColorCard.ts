export const renderCardColor = (status: string): string => {
  const statusColorMap: Record<string, string> = {
    'BELOW WARNING LEVEL': 'bg-green-50 border-green-300',
  };

  ['WARNING_LEVEL', 'WARNING'].forEach(
    (key) => (statusColorMap[key] = 'bg-yellow-50 border-yellow-300'),
  );

  ['DANGER', 'DANGER_LEVEL'].forEach(
    (key) => (statusColorMap[key] = 'bg-red-50 border-red-300'),
  );

  return statusColorMap[status] || '';
};

export const renderStatusColor = (status: string): string => {
  const statusColorMap: Record<string, string> = {
    'BELOW WARNING LEVEL': 'bg-gray-100 text-gray-600',
  };

  ['WARNING_LEVEL', 'WARNING'].forEach(
    (key) => (statusColorMap[key] = 'bg-orange-100 text-orange-400'),
  );

  ['DANGER', 'DANGER_LEVEL'].forEach(
    (key) => (statusColorMap[key] = 'bg-red-200 text-red-500'),
  );

  return statusColorMap[status] || '';
};
