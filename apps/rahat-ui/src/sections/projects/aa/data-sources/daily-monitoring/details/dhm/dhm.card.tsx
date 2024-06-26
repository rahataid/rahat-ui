import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DHMFieldCardsContainer from './dhm.field.cards.container';
import DataSourceCard from '../data.source.card';

type IProps = {
  data: Array<any>;
};

export default function DHMCard({ data }: IProps) {
  const floodForecastData = React.useMemo(() => {
    if (data) {
      return data?.filter(
        (d: any) => d.forecast === '3 Days Flood Forecast Bulletin',
      );
    } else return [];
  }, [data]);

  const rainfallForecastData = React.useMemo(() => {
    if (data) {
      return data?.filter(
        (d: any) => d.forecast === '3 Days Rainfall Forecast Bulletin',
      );
    } else return [];
  }, [data]);

  const realtimeMonitoringData = React.useMemo(() => {
    if (data) {
      return data?.filter(
        (d: any) => d.forecast === 'Realtime Monitoring (River Watch)',
      );
    } else return [];
  }, [data]);

  const nwpData = React.useMemo(() => {
    if (data) {
      return data?.filter((d: any) => d.forecast === 'NWP');
    } else return [];
  }, [data]);
  return (
    <ScrollArea className="h-[calc(100vh-352px)] pr-4" type="always">
      <DataSourceCard
        source="DHM"
        component={
          <DHMFieldCardsContainer
            floodForecastData={floodForecastData[0]}
            rainfallForecastData={rainfallForecastData[0]}
            realtimeMonitoringData={realtimeMonitoringData[0]}
            nwpData={nwpData[0]}
          />
        }
      />
    </ScrollArea>
  );
}
