import { useMemo } from 'react';

export function useForecastData(data: any[]) {
  const floodForecast = useMemo(() => {
    const item = data?.find(
      (d) => d.forecast === '3 Days Flood Forecast Bulletin',
    );
    if (!item) return [];
    return [
      { label: 'Today', value: item.today },
      { label: 'Tomorrow', value: item.tomorrow },
      { label: 'The Day After Tomorrow', value: item.dayAfterTomorrow },
    ];
  }, [data]);

  const rainfallForecast = useMemo(() => {
    const item = data?.find(
      (d) => d.forecast === '3 Days Rainfall Forecast Bulletin',
    );
    if (!item) return [];
    return [
      { label: 'Today Afternoon', value: item.todayAfternoon },
      { label: 'Today Night', value: item.todayNight },
      { label: 'Tomorrow Afternoon', value: item.tomorrowAfternoon },
      { label: 'Tomorrow Night', value: item.tomorrowNight },
      {
        label: 'Day After Tomorrow Afternoon',
        value: item.dayAfterTomorrowAfternoon,
      },
      { label: 'Day After Tomorrow Night', value: item.dayAfterTomorrowNight },
    ];
  }, [data]);

  const realtimeMonitoring = useMemo(() => {
    const item = data?.find(
      (d) => d.forecast === 'Realtime Monitoring (River Watch)',
    );
    return item ? [{ label: 'Water Level', value: item.waterLevel }] : [];
  }, [data]);

  const realtimeRainfall = useMemo(() => {
    const item = data?.find((d) => d.forecast === 'Realtime Rainfall');
    console.log('object', data);
    if (!item) return [];
    return [
      { label: 'Chisapani Karnali', value: item.chisapaniKarnali },
      { label: 'Daulatpur Station', value: item.daulatpurStation },
      { label: 'Bachila Station', value: item.bachilaStation },
      { label: 'Gurba Durbar', value: item.gurbaDurbar },
    ];
  }, [data]);

  // const realtimeRainfall = useMemo(() => {
  //   const item = data?.find(
  //     (d) =>
  //       d.gurbaDurbar !== undefined ||
  //       d.bachilaStation !== undefined ||
  //       d.chisapaniKarnali !== undefined ||
  //       d.daulatpurStation !== undefined,
  //   );
  //   console.log('object', item);
  //   if (!item) return [];

  //   return [
  //     { label: 'Chisapani Karnali', value: item.chisapaniKarnali },
  //     { label: 'Daulatpur Station', value: item.daulatpurStation },
  //     { label: 'Bachila Station', value: item.bachilaStation },
  //     { label: 'Gurba Durbar', value: item.gurbaDurbar },
  //   ].filter((entry) => entry.value !== undefined); // Optional: filter out undefined values
  // }, [data]);

  const nwp = useMemo(() => {
    const item = data?.find((d) => d.forecast === 'NWP');
    if (!item) return [];
    return [
      { label: '24 hours', value: item.hours24NWP },
      { label: '42 hours', value: item.hours48 },
      { label: '72 hours', value: item.hours72NWP },
    ];
  }, [data]);

  return {
    floodForecast,
    rainfallForecast,
    realtimeMonitoring,
    realtimeRainfall,
    nwp,
  };
}
