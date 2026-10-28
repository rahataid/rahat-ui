import React from 'react';
import { useTranslations } from 'next-intl';

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

interface IGlofasHydrographChartProps {
  series: { date: string; min: number; max: number; mean: number }[];
}

const GlofasHydrographChart = ({ series }: IGlofasHydrographChartProps) => {
  const t = useTranslations('AA_PROJECT');
  const formatDate = useDateFormat();
  const formatDigits = useLabelDigits();
  if (!series?.length) return null;

  const chartData = series.map((d) => ({
    ...d,
    date: formatDate(d.date, 'MMM dd'),
    range: [d.min, d.max],
  }));

  // Recharts' default tooltip prints raw JS numbers in ASCII digits since it
  // never routes values through our i18n formatting. Transliterate only —
  // don't round, since the exact backend precision matters here.
  const formatTooltipValue = (value: number) => formatDigits(String(value));

  return (
    <div className="bg-card overflow-hidden p-4 border shadow rounded-sm mt-4">
      <h1 className="font-semibold text-lg mb-4">{t('DISCHARGE_FORECAST_M3S')}</h1>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatDigits} />
          <Tooltip
            formatter={(value: number | number[], name: string) =>
              Array.isArray(value)
                ? [
                    `${formatTooltipValue(value[0])} ~ ${formatTooltipValue(value[1])}`,
                    name,
                  ]
                : [formatTooltipValue(value), name]
            }
          />
          <Legend />
          <Area
            dataKey="range"
            name={t('MIN_MAX_RANGE')}
            stroke="none"
            fill="#93c5fd"
            fillOpacity={0.4}
          />
          <Line
            dataKey="mean"
            name={t('MEAN_DISCHARGE')}
            stroke="#1d4ed8"
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlofasHydrographChart;
