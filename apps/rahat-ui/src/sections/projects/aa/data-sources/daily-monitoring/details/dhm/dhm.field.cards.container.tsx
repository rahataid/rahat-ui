import * as React from 'react';
import FieldCard from '../field.card';

type IProps = {
  floodForecastData?: any;
  rainfallForecastData?: any;
  realtimeMonitoringData?: any;
  nwpData?: any;
};

export default function DHMFieldCardsContainer({
  floodForecastData,
  rainfallForecastData,
  realtimeMonitoringData,
  nwpData,
}: IProps) {
  const floodForecast = [
    { label: 'Today', value: floodForecastData?.today || '-' },
    { label: 'Tomorrow', value: floodForecastData?.tomorrow || '-' },
    {
      label: 'The Day After Tomorrow',
      value: floodForecastData?.dayAfterTomorrow || '-',
    },
  ];

  const rainfallForecast = [
    {
      label: 'Today Afternoon',
      value: rainfallForecastData?.todayAfternoon || '-',
    },
    { label: 'Today Night', value: rainfallForecastData?.todayNight || '-' },
    {
      label: 'Tomorrow Afternoon',
      value: rainfallForecastData?.tomorrowAfternoon || '-',
    },
    {
      label: 'Tomorrow Night',
      value: rainfallForecastData?.tomorrowNight || '-',
    },
    {
      label: 'Day After Tomorrow Afternoon',
      value: rainfallForecastData?.dayAfterTomorrowAfternoon || '-',
    },
    {
      label: 'Day After Tomorrow Night',
      value: rainfallForecastData?.dayAfterTomorrowNight || '-',
    },
  ];

  const realtimeMonitoring = [
    { label: 'Water Level', value: realtimeMonitoringData?.waterLevel || '-' },
  ];

  const nwp = [
    { label: '24 hours', value: nwpData?.hours24NWP || '-' },
    { label: '42 hours', value: nwpData?.hours48 || '-' },
    { label: '72 hours', value: nwpData?.hours72NWP || '-' },
  ];
  return (
    <div className="flex gap-2">
      {floodForecastData && (
        <FieldCard
          source="DHM"
          title={floodForecastData?.forecast}
          data={floodForecast}
        />
      )}
      {rainfallForecastData && (
        <FieldCard
          source="DHM"
          title={rainfallForecastData?.forecast}
          data={rainfallForecast}
        />
      )}
      {realtimeMonitoringData && (
        <FieldCard
          source="DHM"
          title={realtimeMonitoringData?.forecast}
          data={realtimeMonitoring}
        />
      )}
      {nwpData && (
        <FieldCard source="DHM" title={nwpData?.forecast} data={nwp} />
      )}
    </div>
  );
}
