import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useTranslations, useLocale } from 'next-intl';

import { Heading } from 'apps/rahat-ui/src/common';
import {
  Calendar,
  TriangleAlert,
  ChartLine,
  ChartNoAxesColumn,
} from 'lucide-react';
import React from 'react';
import { formateDateFromText } from './utils/formateDataFormTextData';
import { useNumberFormat, useLabelDigits } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

type IProps = {
  glofas: Record<string, any>;
};

export default function GlofasInfoCard({ glofas }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const locale = useLocale();
  const formatNum = useNumberFormat();
  const formatDigits = useLabelDigits();
  const formatDate = useDateFormat();
  const maxProbability = glofas?.info?.pointForecastData?.maxProbability?.data;
  const maxProbabilityDisplay =
    maxProbability == null ? 'N/A' : maxProbability === '' ? '0' : maxProbability;

  // Backend sends this as an opaque "<number> years" string (e.g. "20 years")
  // rather than a numeric field, so the unit word is localized by pattern-matching
  // rather than via a structured value.
  const formatReturnPeriod = (value: string | undefined | null) => {
    if (!value) return 'N/A';
    const match = String(value).match(/^(\d+)\s*years?$/i);
    if (!match) return value;
    return `${formatDigits(match[1])} ${t('YEARS')}`;
  };

  const cardData = React.useMemo(
    () => [
      {
        icon: Calendar,
        label: t('FORECAST_DATE'),
        value: formatDate(glofas?.info?.forecastDate, 'MMMM d, yyyy'),
      },
      {
        icon: Calendar,
        label: t('RETURN_PERIOD'),
        value: formatReturnPeriod(glofas?.info?.returnPeriod),
      },
      {
        icon: ChartNoAxesColumn,
        label: t('DISCHARGE_TENDENCY'),
        value: glofas?.info?.pointForecastData?.dischargeTendencyImage?.data,
      },
      {
        icon: ChartLine,
        label: t('PEAK_FORECASTED'),
        value: formateDateFromText(
          glofas?.info?.pointForecastData?.peakForecasted?.data,
          locale,
        ),
      },
      {
        icon: TriangleAlert,
        label: t('ALERT_LEVEL'),
        value: glofas?.info?.pointForecastData?.alertLevel?.data,
      },
    ],
    [glofas],
  );
  return (
    <div className="flex flex-col space-y-4">
      <div className="p-4 rounded-sm border shadow flex justify-between space-x-4">
        <div className="w-full">
          <div className="flex justify-between gap-4 z-50">
            <Heading
              title={glofas?.source?.riverBasin}
              titleStyle="text-xl/6 font-semibold"
              description={glofas?.source?.riverBasin}
              updatedAt={glofas?.updatedAt}
            />
            <div>
              <Badge className="font-light">{t('STEADY')}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {cardData?.map((d) => {
              const Icon = d.icon;
              return (
                <div className="flex space-x-3 items-center" key={d.label}>
                  <div>
                    <Icon className="text-gray-500" size={20} />
                  </div>
                  <div>
                    <p className="text-sm/6 font-medium mb-1">{d.label}</p>
                    {d.label === 'Discharge Tendency' ? (
                      <img
                        src={d.value}
                        alt={t('DISCHARGE_TENDENCY')}
                        className="w-4 h-4 object-cover"
                      />
                    ) : (
                      <p className="text-sm/4 text-gray-600">{formatNum(d.value)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 rounded-sm border shadow min-w-max">
          <div className="text-center">
            <p className="font-semibold text-xl/10">{t('MAXIMUM_PROBABILITY')}</p>
            <p className="text-xs/4">
              {t('MAX_PROBABILITY_STEP')}{' '}
              {formatDate(
                glofas?.info?.pointForecastData?.maxProbabilityStep?.data,
                'MMMM d, yyyy',
              ) || 'N/A'}
            </p>
          </div>

          <div className="pt-2 text-center">
            <div className="text-primary font-semibold">
              {formatDigits(maxProbabilityDisplay)} %
            </div>
            <div className="text-sm">
              {formatReturnPeriod(glofas?.info?.returnPeriod)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
