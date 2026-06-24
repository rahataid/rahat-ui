export type WatchColors = {
  bg: string;
  border: string;
  textValue: string;
  badge: string;
  statusColor: string;
};

//Shared Utility
export const roundValue = (value: number | undefined, decimals = 1): string => {
  if (value === undefined || value === null) return '--';
  return parseFloat(value.toFixed(decimals)).toString();
};

export const getLatestValue = (history: any[]) => {
  if (!history || !Array.isArray(history) || history.length === 0) return null;
  return history[history.length - 1];
};

const unknownColor: WatchColors = {
  bg: 'bg-gray-50',
  border: 'border-gray-200',
  textValue: 'text-gray-500',
  badge: 'bg-gray-400',
  statusColor: 'bg-gray-100 text-gray-600 border border-gray-300',
};

// Temperature Colors

export const getTemperatureColor = (value: number | undefined): WatchColors => {
  if (value === undefined || value === null) return unknownColor;

  if (value >= 45)
    return {
      bg: 'bg-red-100',
      border: 'border-red-600',
      textValue: 'text-red-700',
      badge: 'bg-red-600',
      statusColor: 'bg-red-100 text-red-800 border border-red-600',
    };
  if (value >= 40)
    return {
      bg: 'bg-orange-100',
      border: 'border-orange-600',
      textValue: 'text-orange-700',
      badge: 'bg-orange-600',
      statusColor: 'bg-orange-100 text-orange-800 border border-orange-600',
    };
  if (value >= 35)
    return {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      textValue: 'text-orange-600',
      badge: 'bg-orange-500',
      statusColor: 'bg-orange-50 text-orange-700 border border-orange-500',
    };
  if (value >= 30)
    return {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      textValue: 'text-orange-600',
      badge: 'bg-orange-400',
      statusColor: 'bg-orange-50 text-orange-700 border border-orange-400',
    };
  if (value >= 25)
    return {
      bg: 'bg-amber-50',
      border: 'border-amber-400',
      textValue: 'text-amber-700',
      badge: 'bg-amber-400',
      statusColor: 'bg-amber-50 text-amber-700 border border-amber-400',
    };
  if (value >= 20)
    return {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      textValue: 'text-yellow-700',
      badge: 'bg-yellow-400',
      statusColor: 'bg-yellow-50 text-yellow-700 border border-yellow-400',
    };
  if (value >= 15)
    return {
      bg: 'bg-lime-50',
      border: 'border-lime-400',
      textValue: 'text-lime-700',
      badge: 'bg-lime-400',
      statusColor: 'bg-lime-50 text-lime-700 border border-lime-400',
    };
  if (value >= 10)
    return {
      bg: 'bg-green-50',
      border: 'border-green-400',
      textValue: 'text-green-700',
      badge: 'bg-green-400',
      statusColor: 'bg-green-50 text-green-700 border border-green-400',
    };
  if (value >= 5)
    return {
      bg: 'bg-green-50',
      border: 'border-green-500',
      textValue: 'text-green-700',
      badge: 'bg-green-500',
      statusColor: 'bg-green-50 text-green-700 border border-green-500',
    };
  if (value >= 0)
    return {
      bg: 'bg-cyan-50',
      border: 'border-cyan-500',
      textValue: 'text-cyan-700',
      badge: 'bg-cyan-500',
      statusColor: 'bg-cyan-50 text-cyan-700 border border-cyan-500',
    };
  if (value >= -5)
    return {
      bg: 'bg-sky-50',
      border: 'border-sky-500',
      textValue: 'text-sky-700',
      badge: 'bg-sky-500',
      statusColor: 'bg-sky-50 text-sky-700 border border-sky-500',
    };
  if (value >= -10)
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      textValue: 'text-blue-700',
      badge: 'bg-blue-500',
      statusColor: 'bg-blue-50 text-blue-700 border border-blue-500',
    };
  if (value >= -15)
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-600',
      textValue: 'text-blue-700',
      badge: 'bg-blue-600',
      statusColor: 'bg-blue-50 text-blue-800 border border-blue-600',
    };
  if (value >= -20)
    return {
      bg: 'bg-indigo-50',
      border: 'border-indigo-600',
      textValue: 'text-indigo-700',
      badge: 'bg-indigo-600',
      statusColor: 'bg-indigo-50 text-indigo-800 border border-indigo-600',
    };
  if (value >= -25)
    return {
      bg: 'bg-violet-50',
      border: 'border-violet-600',
      textValue: 'text-violet-700',
      badge: 'bg-violet-600',
      statusColor: 'bg-violet-50 text-violet-800 border border-violet-600',
    };
  // < -25°C
  return {
    bg: 'bg-purple-50',
    border: 'border-purple-500',
    textValue: 'text-purple-700',
    badge: 'bg-purple-500',
    statusColor: 'bg-purple-50 text-purple-800 border border-purple-500',
  };
};

// Humidity Colors
export const getHumidityColor = (value: number | undefined): WatchColors => {
  if (value === undefined || value === null) return unknownColor;

  if (value >= 100)
    return {
      bg: 'bg-blue-100',
      border: 'border-blue-900',
      textValue: 'text-blue-900',
      badge: 'bg-blue-900',
      statusColor: 'bg-blue-100 text-blue-900 border border-blue-900',
    };
  if (value >= 90)
    return {
      bg: 'bg-blue-100',
      border: 'border-blue-900',
      textValue: 'text-blue-900',
      badge: 'bg-blue-900',
      statusColor: 'bg-blue-100 text-blue-900 border border-blue-900',
    };
  if (value >= 80)
    return {
      bg: 'bg-blue-100',
      border: 'border-blue-600',
      textValue: 'text-blue-800',
      badge: 'bg-blue-600',
      statusColor: 'bg-blue-100 text-blue-900 border border-blue-600',
    };
  if (value >= 70)
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      textValue: 'text-blue-700',
      badge: 'bg-blue-500',
      statusColor: 'bg-blue-50 text-blue-800 border border-blue-500',
    };
  if (value >= 60)
    return {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      textValue: 'text-blue-700',
      badge: 'bg-blue-400',
      statusColor: 'bg-blue-50 text-blue-700 border border-blue-400',
    };
  if (value >= 50)
    return {
      bg: 'bg-cyan-50',
      border: 'border-cyan-600',
      textValue: 'text-cyan-800',
      badge: 'bg-cyan-600',
      statusColor: 'bg-cyan-50 text-cyan-900 border border-cyan-600',
    };
  if (value >= 40)
    return {
      bg: 'bg-cyan-50',
      border: 'border-cyan-500',
      textValue: 'text-cyan-700',
      badge: 'bg-cyan-500',
      statusColor: 'bg-cyan-50 text-cyan-800 border border-cyan-500',
    };
  if (value >= 30)
    return {
      bg: 'bg-cyan-50',
      border: 'border-cyan-400',
      textValue: 'text-cyan-700',
      badge: 'bg-cyan-400',
      statusColor: 'bg-cyan-50 text-cyan-700 border border-cyan-400',
    };
  if (value >= 20)
    return {
      bg: 'bg-cyan-50',
      border: 'border-cyan-300',
      textValue: 'text-cyan-600',
      badge: 'bg-cyan-300',
      statusColor: 'bg-cyan-50 text-cyan-700 border border-cyan-300',
    };
  if (value >= 10)
    return {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      textValue: 'text-cyan-600',
      badge: 'bg-cyan-200',
      statusColor: 'bg-cyan-50 text-cyan-600 border border-cyan-200',
    };
  // < 10%
  return {
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    textValue: 'text-cyan-500',
    badge: 'bg-cyan-100',
    statusColor: 'bg-cyan-50 text-cyan-500 border border-cyan-100',
  };
};
