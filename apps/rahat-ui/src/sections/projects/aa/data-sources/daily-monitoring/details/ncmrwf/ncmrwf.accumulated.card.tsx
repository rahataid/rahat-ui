import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';

type IProps = {
  data: any;
};

export default function AccumulatedCard({ data }: IProps) {
  const renderFieldCardContainer = React.useCallback((data: any) => {
    const sanitizedData = React.useMemo(() => {
      return [
        {
          label: 'Heavy Rainfall Forecast in Karnali Basin (upstream areas)',
          subLabel: '(more than 100mm in consecutive 2-3 days)',
          value: data.heavyRainfallForecastInKarnaliBasin,
        },
        { label: '24 hours', subLabel: '', value: data.hours24 },
        { label: '72 hours', subLabel: '', value: data.hours72 },
        { label: '168 hours', subLabel: '', value: data.hours168 },
      ];
    }, [data]);
    return (
      <div className="flex gap-2">
        {sanitizedData?.map((d: any) => (
          <FieldCard
            key={d.label}
            title={d.label}
            subTitle={d.subLabel}
            source="NCMRWF Accumulated"
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
            source="NCMRWF Accumulated"
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
