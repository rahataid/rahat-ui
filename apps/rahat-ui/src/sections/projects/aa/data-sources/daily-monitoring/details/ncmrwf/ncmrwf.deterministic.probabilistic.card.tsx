import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';

type IProps = {
  data: any;
};

export default function DeterministicAndProbabilisticCard({ data }: IProps) {
  const renderFieldCardContainer = React.useCallback((data: any) => {
    const sanitizedData = React.useMemo(() => {
      return [
        {
          label: 'Extreme Weather Outlook',
          subLabel:
            'Severe Weather Event -Extreme Rainfall >95 Percentile purple dots over Karnali Watershed',
          value: data.extremeWeatherOutlook,
        },
        {
          label: 'Deterministics Prediction System',
          subLabel:
            'Predicts commulative rainfall more than 300 MM in next 3 to 5 Days',
          value: data.deterministicsPredictionSystem,
        },
        {
          label: 'Probabilistic Prediction System',
          subLabel:
            'Heavy Rainfall 115 MM per day 80 percent probablity in next 3 to 5 days',
          value: data.probabilisticPredictionSystem,
        },
      ];
    }, [data]);
    return (
      <div className="flex gap-2">
        {sanitizedData?.map((d: any) => (
          <FieldCard
            key={d.label}
            title={d.label}
            subTitle={d.subLabel}
            source="NCMRWF Deterministic & Probabilistic"
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
            source="NCMRWF Deterministic & Probabilistic"
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
