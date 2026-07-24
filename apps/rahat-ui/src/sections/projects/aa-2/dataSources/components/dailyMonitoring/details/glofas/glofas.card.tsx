import {
  Card,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { BarChart2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import * as React from 'react';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

type IProps = {
  data: any;
};

export default function GLOFASCard({ data }: IProps) {
  const t = useTranslations('AA Project');
  const formatNum = useNumberFormat();
  const sanitizedData = React.useMemo(() => {
    return [
      { label: t('TODAY'), value: data?.[0].data?.todayGLOFAS },
      { label: t('N3_DAYS'), value: data?.[0].data?.days3 },
      { label: t('N5_DAYS'), value: data?.[0].data?.days5 },
      {
        label: t('IN_BETWEEN_TODAY_UNTIL7_DAYS'),
        value:
          data?.[0].data?.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak,
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
          </Card>
        ))}
      </div>
    </div>
  );
}
