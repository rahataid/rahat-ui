import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';

type IProps = {
  data: any;
};

export default function AccumulatedCard({ data }: IProps) {
  const sanitizedData = React.useMemo(() => {
    return data?.map((d: any) => [
      {
        label: 'Heavy Rainfall Forecast in Karnali Basin (upstream areas)',
        subLabel: '(more than 100mm in consecutive 2-3 days)',
        value: d.heavyRainfallForecastInKarnaliBasin,
      },
      { label: '24 hours', subLabel: '', value: d.hours24 },
      { label: '72 hours', subLabel: '', value: d.hours72 },
      { label: '168 hours', subLabel: '', value: d.hours168 },
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
              subTitle={d.subLabel}
              source="NCMRWF Accumulated"
              data={d.value}
            />
          )),
        )}
      </div>
    );
  }, [sanitizedData]);

  return (
    <ScrollArea className="h-[calc(100vh-352px)] pr-4" type="always">
      <DataSourceCard
        source="NCMRWF Accumulated"
        component={renderFieldCardContainer()}
      />
    </ScrollArea>
  );
}
