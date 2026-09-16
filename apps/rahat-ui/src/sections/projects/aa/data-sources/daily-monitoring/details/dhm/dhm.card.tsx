import { useTranslations } from 'next-intl';
import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';
import FieldCard from '../field.card';

type IProps = {
  data: Array<any>;
};

export default function DHMCard({ data }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const renderFieldCardContainer = React.useCallback((data: any) => {
    const floodForecastData = React.useMemo(() => {
      if (data) {
        const result = data.filter(
          (d: any) => d.forecast === '3 Days Flood Forecast Bulletin',
        );
        if (result?.length) {
          return [
            { label: t('TODAY'), value: result[0]?.today },
            { label: t('TOMORROW'), value: result[0]?.tomorrow },
            {
              label: t('DAY_AFTER_TOMORROW'),
              value: result[0]?.dayAfterTomorrow,
            },
          ];
        } else return [];
      } else return [];
    }, [data]);

    const rainfallForecastData = React.useMemo(() => {
      if (data) {
        const result = data.filter(
          (d: any) => d.forecast === '3 Days Rainfall Forecast Bulletin',
        );
        if (result?.length) {
          return [
            {
              label: t('TODAY_AFTERNOON'),
              value: result[0]?.todayAfternoon,
            },
            { label: t('TODAY_NIGHT'), value: result[0]?.todayNight },
            {
              label: t('TOMORROW_AFTERNOON'),
              value: result[0]?.tomorrowAfternoon,
            },
            {
              label: t('TOMORROW_NIGHT'),
              value: result[0]?.tomorrowNight,
            },
            {
              label: t('DAY_AFTER_TOMORROW_AFTERNOON'),
              value: result[0]?.dayAfterTomorrowAfternoon,
            },
            {
              label: t('DAY_AFTER_TOMORROW_NIGHT'),
              value: result[0]?.dayAfterTomorrowNight,
            },
          ];
        } else return [];
      } else return [];
    }, [data]);

    const realtimeMonitoringData = React.useMemo(() => {
      if (data) {
        const result = data.filter(
          (d: any) => d.forecast === 'Realtime Monitoring (River Watch)',
        );
        if (result?.length) {
          return [{ label: t('WATER_LEVEL'), value: result[0]?.waterLevel }];
        } else return [];
      } else return [];
    }, [data]);

    const realtimeRainfallData = React.useMemo(() => {
      if (data) {
        const result = data.filter(
          (d: any) => d.forecast === 'Realtime Rainfall',
        );
        if (result?.length) {
          return [
            { label: 'Chisapani Karnali', value: result[0]?.chisapaniKarnali },
            { label: 'Daulatpur Station', value: result[0]?.daulatpurStation },
            { label: 'Bachila Station', value: result[0]?.bachilaStation },
            { label: 'Gurba Durbar', value: result[0]?.gurbaDurbar },
          ];
        } else return [];
      } else return [];
    }, [data]);

    const nwpData = React.useMemo(() => {
      if (data) {
        const result = data.filter((d: any) => d.forecast === 'NWP');
        if (result?.length) {
          return [
            { label: `24 ${t('HOURS')}`, value: result[0]?.hours24NWP },
            { label: `42 ${t('HOURS')}`, value: result[0]?.hours48 },
            { label: `72 ${t('HOURS')}`, value: result[0]?.hours72NWP },
          ];
        } else return [];
      } else return [];
    }, [data]);

    return (
      <div className="flex gap-2">
        {floodForecastData?.length > 0 && (
          <FieldCard
            source="DHM"
            title={t('N3_DAYS_FLOOD_FORECAST_BULLETIN')}
            data={floodForecastData}
          />
        )}
        {rainfallForecastData?.length > 0 && (
          <FieldCard
            source="DHM"
            title={t('N3_DAYS_RAINFALL_FORECAST_BULLETIN')}
            data={rainfallForecastData}
          />
        )}

        {realtimeMonitoringData?.length > 0 && (
          <FieldCard
            source="DHM"
            title={t('REALTIME_MONITORING_RIVER_WATCH')}
            data={realtimeMonitoringData}
          />
        )}

        {realtimeRainfallData?.length > 0 && (
          <FieldCard
            source="DHM"
            title={t('REALTIME_RAINFALL')}
            data={realtimeRainfallData}
          />
        )}

        {nwpData?.length > 0 && (
          <FieldCard source="DHM" title="NWP" data={nwpData} />
        )}
      </div>
    );
  }, []);
  return (
    <ScrollArea className="h-[calc(100vh-352px)] pr-4" type="always">
      <div className="grid gap-4">
        {data?.map((d: any) => (
          <DataSourceCard
            key={d.dataEntryBy}
            source="DHM"
            dataEntryBy={d.dataEntryBy}
            day={getDayOfWeek(d.createdAt)}
            date={formatdbDate(d.createdAt)}
            component={renderFieldCardContainer(d.data)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
