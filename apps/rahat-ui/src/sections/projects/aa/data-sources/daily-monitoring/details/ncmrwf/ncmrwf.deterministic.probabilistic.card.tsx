import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';

type IProps = {
  data: any;
};

export default function DeterministicAndProbabilisticCard({ data }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const renderFieldCardContainer = React.useCallback((data: any) => {
    const sanitizedData = React.useMemo(() => {
      return [
        {
          label: t('EXTREME_WEATHER_OUTLOOK'),
          subLabel: t('EXTREME_WEATHER_SUBLABEL'),
          value: data.extremeWeatherOutlook,
        },
        {
          label: t('DETERMINISTICS_PREDICTION_SYSTEM'),
          subLabel: t('DETERMINISTICS_SUBLABEL'),
          value: data.deterministicsPredictionSystem,
        },
        {
          label: t('PROBABILISTIC_PREDICTION_SYSTEM'),
          subLabel: t('PROBABILISTIC_SUBLABEL'),
          value: data.probabilisticPredictionSystem,
        },
      ];
    }, [data, t]);
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
