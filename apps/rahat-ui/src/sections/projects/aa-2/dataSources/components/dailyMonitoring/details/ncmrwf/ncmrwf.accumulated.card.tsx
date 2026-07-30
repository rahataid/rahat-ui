import * as React from 'react';
import { useTranslations } from 'next-intl';

import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';
import { formatdbDate, getDayOfWeek } from 'apps/rahat-ui/src/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { BarChart2 } from 'lucide-react';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

type IProps = {
  data: any;
};

export default function AccumulatedCard({ data }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const sanitizedData = React.useMemo(() => {
    return [
      { label: t('N24_HOURS'), subLabel: '', value: data?.[0].data?.hours24 },
      { label: t('N72_HOURS'), subLabel: '', value: data?.[0].data?.hours72 },
      { label: t('N168_HOURS'), subLabel: '', value: data?.[0].data?.hours168 },
      {
        label: 'Heavy Rainfall Forecast in Karnali Basin (upstream areas)',
        subLabel: t('HEAVY_RAINFALL_SUBLABEL'),
        value: data?.[0].data?.heavyRainfallForecastInKarnaliBasin,
      },
    ];
  }, [data]);
  return (
    <div className="w-full p-6 bg-white border rounded-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sanitizedData?.map((d: any) => (
          <Card className="border-none shadow-none" key={d.label}>
            <CardHeader className="pb-2 flex flex-row gap-2 items-center">
              <div className="">
                <BarChart2 className="h-6 w-6 text-slate-500" />
              </div>
              <div className="flex  flex-col gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-base font-semibold">
                    {d.label}
                    <div className="text-md font-normal break-words">
                      {formatNum(d.value)}
                    </div>
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <p className="text-sm text-slate-700 mt-1 break-words">
                {d.subLabel}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
