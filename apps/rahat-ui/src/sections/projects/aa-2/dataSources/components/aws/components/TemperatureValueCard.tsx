import { useTranslations } from 'next-intl';
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
  label: propLabel,
  colors,
}: TemperatureValueCardProps) {
  const t = useTranslations('AA Project');
  const tGlobal = useTranslations('GLOBAL');
  const colorScheme = colors || getTemperatureColor(value);
  const label = propLabel ?? t('AVERAGE_TEMPERATURE');

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
          : tGlobal('NO_DATA_AVAILABLE')}
      </p>
    </div>
  );
}
