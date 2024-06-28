import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';

type IProps = {
  data: any;
};

export default function GLOFASCard({ data }: IProps) {
  const renderFieldCardContainer = React.useCallback((data: any) => {
    const sanitizedData = React.useMemo(() => {
      return [
        { label: 'Today', value: data.todayGLOFAS },
        { label: '3 Days', value: data.days3 },
        { label: '5 Days', value: data.days5 },
        {
          label:
            'In between today until 7 Days is there any possibility of peak',
          value: data.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak,
        },
      ];
    }, [data]);
    return (
      <div className="flex gap-2">
        {sanitizedData?.map((d: any) => (
          <FieldCard
            key={d.label}
            title={d.label}
            source="GLOFAS"
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
            source="GLOFAS"
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
