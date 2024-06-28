import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';

type IProps = {
  data: any;
};

export default function FlashFloodRiskMonitoringCard({ data }: IProps) {
  const renderFieldCardContainer = React.useCallback((data: any) => {
    const sanitizedData = React.useMemo(() => {
      return [{ label: 'Status', value: data.status }];
    }, [data]);
    return (
      <div className="grid grid-cols-4">
        {sanitizedData?.map((d: any) => (
          <FieldCard
            key={d.label}
            title={d.label}
            source="Flash Flood Risk Monitoring"
            data={d.value}
          />
        ))}
      </div>
    );
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-352px)] pr-4" type="always">
      <div className="grid gap-4">
        {data?.map((d: any) => (
          <DataSourceCard
            key={d.dataEntryBy}
            source="Flash Flood Risk Monitoring"
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
