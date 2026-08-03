import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';

type IProps = {
  data: any;
};

export default function AccumulatedCard({ data }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const renderFieldCardContainer = React.useCallback((data: any) => {
    const sanitizedData = React.useMemo(() => {
      return [
        {
          label: t('HEAVY_RAINFALL_FORECAST_KARNALI_BASIN'),
          subLabel: t('HEAVY_RAINFALL_SUBLABEL'),
          value: data.heavyRainfallForecastInKarnaliBasin,
        },
        { label: t('N24_HOURS'), subLabel: '', value: data.hours24 },
        { label: t('N72_HOURS'), subLabel: '', value: data.hours72 },
        { label: t('N168_HOURS'), subLabel: '', value: data.hours168 },
      ];
    }, [data, t]);
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
