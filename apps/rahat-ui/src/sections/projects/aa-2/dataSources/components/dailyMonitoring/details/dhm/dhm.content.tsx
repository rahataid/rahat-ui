'use client';

import React from 'react';
import MonitoringCard from './monitorig.card';
import { useForecastData } from './useForcastData';
import { BarChart2 } from 'lucide-react';

interface ForecastData {
  title: string;
  source?: string;
  data: { label: string; value: string | number }[];
}

const ForecastCard = ({ title, data }: ForecastData) => (
  <MonitoringCard title={title} className="">
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center w-full gap-2">
          <BarChart2 />
          <div>
            <p className="font-medium">{item.label}</p>
            <p className="text-sm text-slate-500">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  </MonitoringCard>
);

export const DhmContent = ({ data }: { data: any }) => {
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
      title: '3 Days Flood Forecast Bulletin',
      data: floodForecast,
    },
    rainfallForecast.length > 0 && {
      title: '3 Days Rainfall Forecast Bulletin',
      data: rainfallForecast,
    },
    realtimeMonitoring.length > 0 && {
      title: 'Realtime Monitoring (River Watch)',
      data: realtimeMonitoring,
    },
    realtimeRainfall.length > 0 && {
      title: 'Realtime Rainfall',
      data: realtimeRainfall,
    },
    nwp.length > 0 && {
      title: 'NWP',
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
          No forecast data available.
        </div>
      )}
    </div>
  );
};
