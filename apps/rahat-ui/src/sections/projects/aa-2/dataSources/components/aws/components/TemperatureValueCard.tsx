import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useTranslations } from 'next-intl';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
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
  const t = useTranslations('AA_PROJECT');
  const tGlobal = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const colorScheme = colors || getTemperatureColor(value);
  const label = propLabel ?? t('AVERAGE_TEMPERATURE');

  return (
    <div
      className={`p-2 border rounded-sm text-center min-w-[200px] ${colorScheme.bg}`}
    >
      <p className={`font-semibold text-3xl ${colorScheme.textValue}`}>
        {value !== undefined ? formatNum(roundValue(value)) : '--'}
        {unit}
      </p>
      <p className="text-sm font-medium mt-1">{label}</p>
      <p className="text-xs text-gray-500 mt-1">
        {updatedAt
          ? formatDate(updatedAt, 'eee, MMM d yyyy, hh:mm:ss a')
          : tGlobal('NO_DATA_AVAILABLE')}
      </p>
    </div>
  );
}
