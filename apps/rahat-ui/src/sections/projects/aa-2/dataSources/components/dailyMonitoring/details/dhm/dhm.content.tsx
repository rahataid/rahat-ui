'use client';

import React from 'react';
import MonitoringCard from './monitorig.card';
import { useForecastData } from './useForcastData';
import { BarChart2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

interface ForecastData {
  title: string;
  source?: string;
  data: { label: string; value: string | number }[];
}

const ForecastCard = ({ title, data }: ForecastData) => {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();

  // Flood trend fields (today/tomorrow/day-after) arrive as enum-like
  // words (Steady/Increase/Decrease), not numbers, so they need a
  // translation lookup instead of the numeric formatter.
  const formatValue = (value: string | number) =>
    translateValue(t, value, { fallback: formatNum(value) });

  return (
  <MonitoringCard title={title} className="">
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center w-full gap-2">
          <BarChart2 />
          <div>
            <p className="font-medium">{item.label}</p>
            <p className="text-sm text-slate-500">{formatValue(item.value)}</p>
          </div>
        </div>
      ))}
    </div>
  </MonitoringCard>
  );
};

export const DhmContent = ({ data }: { data: any }) => {
  const t = useTranslations('AA_PROJECT');
  const {
    floodForecast,
    rainfallForecast,
    realtimeMonitoring,
    realtimeRainfall,
    nwp,
  } = useForecastData(data?.[0].data);
  const isForecastCard = (card: unknown): card is ForecastData => {
    return (
      !!card && typeof card === 'object' && 'title' in card && 'data' in card
    );
  };
  const forecastCards: ForecastData[] = [
    floodForecast.length > 0 && {
      title: t('N3_DAYS_FLOOD_FORECAST_BULLETIN'),
      data: floodForecast,
    },
    rainfallForecast.length > 0 && {
      title: t('N3_DAYS_RAINFALL_FORECAST_BULLETIN'),
      data: rainfallForecast,
    },
    realtimeMonitoring.length > 0 && {
      title: t('REALTIME_MONITORING_RIVER_WATCH'),
      data: realtimeMonitoring,
    },
    realtimeRainfall.length > 0 && {
      title: t('REALTIME_RAINFALL'),
      data: realtimeRainfall,
    },
    nwp.length > 0 && {
      title: t('NWP'),
      data: nwp,
    },
  ].filter(isForecastCard);
  return (
    <div className="w-full border rounded-sm">
      {forecastCards.length > 0 ? (
        <div
          className={`grid gap-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${forecastCards.length}`}
        >
          {forecastCards.map((card, idx) => (
            <ForecastCard key={idx} title={card.title} data={card.data} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          {t('NO_FORECAST_DATA_AVAILABLE')}
        </div>
      )}
    </div>
  );
};
