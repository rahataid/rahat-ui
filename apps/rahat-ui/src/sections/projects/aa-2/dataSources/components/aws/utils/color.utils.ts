
export type WatchColors = {
  bg: string;
  border: string;
  textValue: string;
  badge: string;
  statusLabel: string;
  statusColor: string;
};

//Shared Utility 

export const roundValue = (value: number | undefined): string => {
  if (value === undefined || value === null) return '--';
  return parseFloat(value.toFixed(3)).toString();
};

const unknownColor: WatchColors = {
  bg: 'bg-gray-50',
  border: 'border-gray-200',
  textValue: 'text-gray-500',
  badge: 'bg-gray-400',
  statusLabel: 'Unknown',
  statusColor: 'bg-gray-100 text-gray-600 border border-gray-300',
};

// Temperature Colors 

export const getTemperatureColor = (value: number | undefined): WatchColors => {
  if (value === undefined || value === null) return unknownColor;
  if (value >= 100)
    return {
      bg: 'bg-red-100',
      border: 'border-red-300',
      textValue: 'text-red-700',
      badge: 'bg-red-500',
      statusLabel: 'Extreme Heat',
      statusColor: 'bg-red-200 text-red-800 border border-red-400',
    };
  if (value >= 90)
    return {
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      textValue: 'text-orange-700',
      badge: 'bg-orange-500',
      statusLabel: 'Very Hot',
      statusColor: 'bg-orange-200 text-orange-800 border border-orange-400',
    };
  if (value >= 80)
    return {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      textValue: 'text-amber-700',
      badge: 'bg-amber-500',
      statusLabel: 'Hot',
      statusColor: 'bg-amber-200 text-amber-800 border border-amber-400',
    };
  if (value >= 70)
    return {
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
      textValue: 'text-yellow-700',
      badge: 'bg-yellow-500',
      statusLabel: 'Warm-Hot',
      statusColor: 'bg-yellow-200 text-yellow-800 border border-yellow-400',
    };
  if (value >= 60)
    return {
      bg: 'bg-lime-100',
      border: 'border-lime-300',
      textValue: 'text-lime-700',
      badge: 'bg-lime-500',
      statusLabel: 'Warm',
      statusColor: 'bg-lime-200 text-lime-800 border border-lime-400',
    };
  if (value >= 50)
    return {
      bg: 'bg-green-100',
      border: 'border-green-300',
      textValue: 'text-green-700',
      badge: 'bg-green-500',
      statusLabel: 'Mild-Warm',
      statusColor: 'bg-green-200 text-green-800 border border-green-400',
    };
  if (value >= 40)
    return {
      bg: 'bg-teal-100',
      border: 'border-teal-300',
      textValue: 'text-teal-700',
      badge: 'bg-teal-500',
      statusLabel: 'Mild',
      statusColor: 'bg-teal-200 text-teal-800 border border-teal-400',
    };
  if (value >= 30)
    return {
      bg: 'bg-cyan-100',
      border: 'border-cyan-300',
      textValue: 'text-cyan-700',
      badge: 'bg-cyan-500',
      statusLabel: 'Mild',
      statusColor: 'bg-cyan-200 text-cyan-800 border border-cyan-400',
    };
  if (value >= 20)
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      textValue: 'text-yellow-700',
      badge: 'bg-yellow-400',
      statusLabel: 'Cool',
      statusColor: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    };
  return {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    textValue: 'text-blue-700',
    badge: 'bg-blue-400',
    statusLabel: 'Cold',
    statusColor: 'bg-blue-100 text-blue-800 border border-blue-300',
  };
};

//  Humidity Colors 

export const getHumidityColor = (value: number | undefined): WatchColors => {
  if (value === undefined || value === null) return unknownColor;
  if (value >= 90)
    return {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      textValue: 'text-blue-800',
      badge: 'bg-blue-600',
      statusLabel: 'Very High',
      statusColor: 'bg-blue-200 text-blue-900 border border-blue-400',
    };
  if (value >= 80)
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      textValue: 'text-blue-700',
      badge: 'bg-blue-500',
      statusLabel: 'High',
      statusColor: 'bg-blue-100 text-blue-800 border border-blue-300',
    };
  if (value >= 70)
    return {
      bg: 'bg-cyan-100',
      border: 'border-cyan-300',
      textValue: 'text-cyan-800',
      badge: 'bg-cyan-500',
      statusLabel: 'Moderately High',
      statusColor: 'bg-cyan-200 text-cyan-800 border border-cyan-400',
    };
  if (value >= 60)
    return {
      bg: 'bg-teal-50',
      border: 'border-teal-300',
      textValue: 'text-teal-700',
      badge: 'bg-teal-500',
      statusLabel: 'Moderate',
      statusColor: 'bg-teal-100 text-teal-800 border border-teal-300',
    };
  if (value >= 50)
    return {
      bg: 'bg-green-50',
      border: 'border-green-200',
      textValue: 'text-green-700',
      badge: 'bg-green-400',
      statusLabel: 'Comfortable',
      statusColor: 'bg-green-100 text-green-800 border border-green-300',
    };
  if (value >= 40)
    return {
      bg: 'bg-lime-50',
      border: 'border-lime-200',
      textValue: 'text-lime-700',
      badge: 'bg-lime-400',
      statusLabel: 'Comfortable',
      statusColor: 'bg-lime-100 text-lime-800 border border-lime-300',
    };
  if (value >= 30)
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      textValue: 'text-yellow-700',
      badge: 'bg-yellow-400',
      statusLabel: 'Low',
      statusColor: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    };
  if (value >= 20)
    return {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      textValue: 'text-orange-700',
      badge: 'bg-orange-400',
      statusLabel: 'Very Low',
      statusColor: 'bg-orange-100 text-orange-800 border border-orange-300',
    };
  return {
    bg: 'bg-red-50',
    border: 'border-red-200',
    textValue: 'text-red-700',
    badge: 'bg-red-400',
    statusLabel: 'Extremely Dry',
    statusColor: 'bg-red-100 text-red-800 border border-red-300',
  };
};
