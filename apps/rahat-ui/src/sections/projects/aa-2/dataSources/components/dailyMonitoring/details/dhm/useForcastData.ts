import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export function useForecastData(data: any[]) {
  const t = useTranslations('AA_PROJECT');
  const floodForecast = useMemo(() => {
    const item = data?.find(
      (d) => d.forecast === '3 Days Flood Forecast Bulletin',
    );
    if (!item) return [];
    return [
      { label: t('TODAY'), value: item.today },
      { label: t('TOMORROW'), value: item.tomorrow },
      { label: t('DAY_AFTER_TOMORROW'), value: item.dayAfterTomorrow },
    ];
  }, [data, t]);

  const rainfallForecast = useMemo(() => {
    const item = data?.find(
      (d) => d.forecast === '3 Days Rainfall Forecast Bulletin',
    );
    if (!item) return [];
    return [
      { label: t('TODAY_AFTERNOON'), value: item.todayAfternoon },
      { label: t('TODAY_NIGHT'), value: item.todayNight },
      { label: t('TOMORROW_AFTERNOON'), value: item.tomorrowAfternoon },
      { label: t('TOMORROW_NIGHT'), value: item.tomorrowNight },
      {
        label: t('DAY_AFTER_TOMORROW_AFTERNOON'),
        value: item.dayAfterTomorrowAfternoon,
      },
      { label: t('DAY_AFTER_TOMORROW_NIGHT'), value: item.dayAfterTomorrowNight },
    ];
  }, [data, t]);

  const realtimeMonitoring = useMemo(() => {
    const item = data?.find(
      (d) => d.forecast === 'Realtime Monitoring (River Watch)',
    );
    return item ? [{ label: t('WATER_LEVEL'), value: item.waterLevel }] : [];
  }, [data, t]);

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
      { label: `24 ${t('HOURS')}`, value: item.hours24NWP },
      { label: `42 ${t('HOURS')}`, value: item.hours48 },
      { label: `72 ${t('HOURS')}`, value: item.hours72NWP },
    ];
  }, [data, t]);

  return {
    floodForecast,
    rainfallForecast,
    realtimeMonitoring,
    realtimeRainfall,
    nwp,
  };
}
