import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  getTemperatureColor,
  roundValue,
  WatchColors,
} from '../utils/color.utils';

interface TemperatureValueCardProps {
  value?: number;
  unit?: string;
  updatedAt?: string;
  label?: string;
  colors?: WatchColors;
}

export function TemperatureValueCard({
  value,
  unit = '°C',
  updatedAt,
  label = 'Average Temperature',
  colors,
}: TemperatureValueCardProps) {
  const colorScheme = colors || getTemperatureColor(value);

  return (
    <div
      className={`p-2 border rounded-sm text-center min-w-[200px] ${colorScheme.bg}`}
    >
      <p className={`font-semibold text-3xl ${colorScheme.textValue}`}>
        {value !== undefined ? roundValue(value) : '--'}
        {unit}
      </p>
      <p className="text-sm font-medium mt-1">{label}</p>
      <p className="text-xs text-gray-500 mt-1">
        {updatedAt
          ? dateFormat(updatedAt, 'eee, MMM d yyyy, hh:mm:ss a')
          : 'No data available'}
      </p>
    </div>
  );
}
