import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';

type IProps = {
  data: any;
};

export default function DeterministicAndProbabilisticCard({ data }: IProps) {
  const sanitizedData = React.useMemo(() => {
    return data?.map((d: any) => [
      {
        label: 'Extreme Weather Outlook',
        subLabel:
          'Severe Weather Event -Extreme Rainfall >95 Percentile purple dots over Karnali Watershed',
        value: d.extremeWeatherOutlook,
      },
      {
        label: 'Deterministics Prediction System',
        subLabel:
          'Predicts commulative rainfall more than 300 MM in next 3 to 5 Days',
        value: d.deterministicsPredictionSystem,
      },
      {
        label: 'Probabilistic Prediction System',
        subLabel:
          'Heavy Rainfall 115 MM per day 80 percent probablity in next 3 to 5 days',
        value: d.probabilisticPredictionSystem,
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
              subTitle={d.subLabel}
              source="NCMWRF Deterministic & Probabilistic"
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
        source="NCMWRF Deterministic & Probabilistic"
        component={renderFieldCardContainer()}
      />
    </ScrollArea>
  );
}
