import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';
import FieldCard from '../field.card';

type IProps = {
  data: Array<any>;
};

export default function DHMCard({ data }: IProps) {
  const renderFieldCardContainer = React.useCallback((data: any) => {
    const floodForecastData = React.useMemo(() => {
      if (data) {
        const result = data.filter(
          (d: any) => d.forecast === '3 Days Flood Forecast Bulletin',
        );
        if (result?.length) {
          return [
            { label: 'Today', value: result[0]?.today },
            { label: 'Tomorrow', value: result[0]?.tomorrow },
            {
              label: 'The Day After Tomorrow',
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
              label: 'Today Afternoon',
              value: result[0]?.todayAfternoon,
            },
            { label: 'Today Night', value: result[0]?.todayNight },
            {
              label: 'Tomorrow Afternoon',
              value: result[0]?.tomorrowAfternoon,
            },
            {
              label: 'Tomorrow Night',
              value: result[0]?.tomorrowNight,
            },
            {
              label: 'Day After Tomorrow Afternoon',
              value: result[0]?.dayAfterTomorrowAfternoon,
            },
            {
              label: 'Day After Tomorrow Night',
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
          return [{ label: 'Water Level', value: result[0]?.waterLevel }];
        } else return [];
      } else return [];
    }, [data]);

    const nwpData = React.useMemo(() => {
      if (data) {
        const result = data.filter((d: any) => d.forecast === 'NWP');
        if (result?.length) {
          return [
            { label: '24 hours', value: result[0]?.hours24NWP },
            { label: '42 hours', value: result[0]?.hours48 },
            { label: '72 hours', value: result[0]?.hours72NWP },
          ];
        } else return [];
      } else return [];
    }, [data]);

    return (
      <div className="flex gap-2">
        {floodForecastData?.length > 0 && (
          <FieldCard
            source="DHM"
            title="3 Days Flood Forecast Bulletin"
            data={floodForecastData}
          />
        )}
        {rainfallForecastData?.length > 0 && (
          <FieldCard
            source="DHM"
            title="3 Days Rainfall Forecast Bulletin"
            data={rainfallForecastData}
          />
        )}

        {realtimeMonitoringData?.length > 0 && (
          <FieldCard
            source="DHM"
            title="Realtime Monitoring (River Watch)"
            data={realtimeMonitoringData}
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
