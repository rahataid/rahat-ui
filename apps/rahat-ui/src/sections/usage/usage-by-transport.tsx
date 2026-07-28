'use client';

import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { ChartColumnStacked } from '@rahat-ui/shadcn/src/components/charts';

type TransportUsage = {
  transportCuid: string;
  transportName: string;
  transportType: string;
  broadcasts: number;
  success: number;
  fail: number;
  chars: number;
  segments: number;
  duration: number;
  calls: number;
  credits: number;
};

type UsageByTransportProps = {
  byTransport?: TransportUsage[];
};

const TRANSPORT_COLORS: Record<string, string> = {
  API: '#4A90E2',
  SMTP: '#00b67a',
  VOICE: '#FFA726',
};

function getColor(transportType: string, index: number) {
  const fallbackColors = ['#7a00b6', '#007bb6', '#8BC34A', '#F06292'];
  return (
    TRANSPORT_COLORS[transportType] ||
    fallbackColors[index % fallbackColors.length]
  );
}

export default function UsageByTransport({
  byTransport,
}: UsageByTransportProps) {
  const t = useTranslations('Usage');
  const formatNum = useNumberFormat();
  if (!byTransport || byTransport.length === 0) return null;

  const pieData = {
    series: byTransport.map((t) => ({
      label: t.transportName,
      value: t.broadcasts,
    })),
    colors: byTransport.map((t, i) => getColor(t.transportType, i)),
    // PieChart spreads these over its own defaults, so the donut/tooltip
    // formatters have to be restated in full to keep the numerals localised.
    options: {
      dataLabels: {
        enabled: true,
        formatter: (val: number | string) =>
          `${formatNum(Number(val).toFixed(1))}%`,
      },
      tooltip: {
        fillSeriesColor: true,
        y: {
          formatter: (val: number) => formatNum(val),
          title: { formatter: (seriesName: string) => `${seriesName}` },
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              value: { formatter: (val: number | string) => formatNum(val) },
              total: {
                show: true,
                formatter: (w: { globals: { seriesTotals: number[] } }) =>
                  formatNum(
                    w.globals.seriesTotals.reduce((a, b) => a + b, 0),
                  ),
              },
            },
          },
        },
      },
    },
  };

  const barNumberOptions = {
    yaxis: { labels: { formatter: (val: number) => formatNum(val) } },
    tooltip: { y: { formatter: (val: number) => formatNum(val) } },
  };

  const barSeries = [
    {
      name: t('SUCCESS'),
      data: byTransport.map((t) => t.success),
    },
    {
      name: t('FAILED'),
      data: byTransport.map((t) => t.fail),
    },
  ];
  const barCategories = byTransport.map((t) => t.transportName);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('USAGE_BY_TRANSPORT')}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('DISTRIBUTION_BY_TRANSPORT')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart
              custom
              type="donut"
              chart={pieData}
              height={300}
              width={400}
              donutSize="70%"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('SUCCESS_VS_FAILURE_BY_TRANSPORT')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartColumnStacked
              series={barSeries}
              categories={barCategories}
              height={300}
              width="100%"
              custom
              options={barNumberOptions}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
