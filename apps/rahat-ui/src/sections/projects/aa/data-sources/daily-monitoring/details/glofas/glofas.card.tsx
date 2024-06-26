import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';

type IProps = {
  data: any;
};

export default function GLOFASCard({ data }: IProps) {
  const sanitizedData = React.useMemo(() => {
    return data?.map((d: any) => [
      { label: 'Today', value: d.todayGLOFAS },
      { label: '3 Days', value: d.days3 },
      { label: '5 Days', value: d.days5 },
      {
        label: 'In between today until 7 Days is there any possibility of peak',
        value: d.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak,
      },
    ]);
  }, [data]);

  const renderFieldCardContainer = React.useCallback(() => {
    return (
      <div className="flex gap-2">
        {sanitizedData?.map((item: any) =>
          item?.map((d: any) => (
            <FieldCard
              key={d.label}
              title={d.label}
              source="GLOFAS"
              data={d.value}
            />
          )),
        )}
      </div>
    );
  }, [sanitizedData]);

  return (
    <ScrollArea className="h-[calc(100vh-352px)] pr-4" type="always">
      <DataSourceCard source="GLOFAS" component={renderFieldCardContainer()} />
    </ScrollArea>
  );
}
