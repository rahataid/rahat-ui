'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { DataCard, TableLoader, NoResult } from 'apps/rahat-ui/src/common';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { CommunicationOverviewData, classifyTransportString } from '@rahat-ui/query';
import {
  PieChart,
  ChartColumnStacked,
} from '@rahat-ui/shadcn/src/components/charts';
import {
  Radio,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from 'lucide-react';

const CHANNEL_LABEL_KEYS: Record<string, string> = {
  VOICE: 'VOICE',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  WHATSAPP: 'WHATSAPP',
};

export type CommunicationOverviewStatsProps = {
  data?: CommunicationOverviewData;
  isLoading?: boolean;
  activeStatus?: string;
  onSelectStatus?: (status?: string) => void;
};

const CHANNEL_COLORS: Record<string, string> = {
  SMS: '#4A90E2',
  VOICE: '#FFA726',
  EMAIL: '#00b67a',
  WHATSAPP: '#25D366',
};

const SUCCESS_COLOR = '#16A34A';
const FAILED_COLOR = '#DC2626';
const PENDING_COLOR = '#F59E0B';

const FALLBACK_COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

function buildDonutOptions(
  formatNum: (v: number | string) => string,
  totalLabel: string,
  total: number,
) {
  return {
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
              label: totalLabel,
              formatter: () => formatNum(total),
            },
          },
        },
      },
    },
  };
}

function getChannelColor(channel: string, index: number) {
  return (
    CHANNEL_COLORS[channel.toUpperCase()] ||
    FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  );
}

export const CommunicationTopKpis = React.memo(
  function CommunicationTopKpis({
    data,
    isLoading = false,
    activeStatus,
    onSelectStatus,
  }: CommunicationOverviewStatsProps) {
    const t = useTranslations('USAGE');
    const formatNum = useNumberFormat();

    const overall = React.useMemo(
      () =>
        data?.overall ?? {
          totalCommunications: 0,
          successful: 0,
          failed: 0,
          pending: 0,
          totalRecipients: 0,
          successRate: 0,
        },
      [data?.overall],
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-full">
        <div
          onClick={() => onSelectStatus?.(undefined)}
          className={`cursor-pointer transition-all rounded-lg ${
            !activeStatus ? 'ring-2 ring-primary/60' : 'hover:opacity-90'
          }`}
          title={t('VIEW_ALL_COMMUNICATIONS')}
        >
          <DataCard
            title={t('TOTAL_BROADCASTS')}
            number={formatNum(overall.totalCommunications)}
            Icon={Radio}
            loading={isLoading}
            subtitle={t('ALL_PROJECTS')}
          />
        </div>

        <div
          onClick={() => onSelectStatus?.('COMPLETED')}
          className={`cursor-pointer transition-all rounded-lg ${
            activeStatus === 'COMPLETED'
              ? 'ring-2 ring-green-600'
              : 'hover:opacity-90'
          }`}
          title={t('FILTER_COMPLETED_COMMUNICATIONS')}
        >
          <DataCard
            title={t('SUCCESS_RATE')}
            number={`${formatNum(overall.successRate)}%`}
            Icon={CheckCircle}
            loading={isLoading}
            subtitle={`${formatNum(overall.successful)} ${t('DELIVERED')}`}
            iconStyle="text-green-600 bg-green-100"
          />
        </div>

        <div
          onClick={() => onSelectStatus?.('FAILED')}
          className={`cursor-pointer transition-all rounded-lg ${
            activeStatus === 'FAILED'
              ? 'ring-2 ring-red-600'
              : 'hover:opacity-90'
          }`}
          title={t('FILTER_FAILED_COMMUNICATIONS')}
        >
          <DataCard
            title={t('FAILED')}
            number={formatNum(overall.failed)}
            Icon={XCircle}
            loading={isLoading}
            subtitle={t('DELIVERY_FAILURES')}
            iconStyle="text-red-600 bg-red-100"
          />
        </div>

        <div
          onClick={() => onSelectStatus?.('IN_PROGRESS')}
          className={`cursor-pointer transition-all rounded-lg ${
            activeStatus === 'IN_PROGRESS'
              ? 'ring-2 ring-amber-600'
              : 'hover:opacity-90'
          }`}
          title={t('FILTER_PENDING_COMMUNICATIONS')}
        >
          <DataCard
            title={t('TOTAL_RECIPIENTS')}
            number={formatNum(overall.totalRecipients)}
            Icon={Users}
            loading={isLoading}
            subtitle={`${formatNum(overall.pending)} ${t('PENDING')}`}
            iconStyle="text-blue-600 bg-blue-100"
          />
        </div>
      </div>
    );
  },
);

CommunicationTopKpis.displayName = 'CommunicationTopKpis';

type AudienceProgressRowProps = {
  label: string;
  total: number;
  delivered: number;
  failed: number;
  pending: number;
  successRate: number;
  failRate: number;
  pendingRate: number;
  formatNum: (v: number | string) => string;
  t: (key: string) => string;
  borderTop?: boolean;
};

const AudienceProgressRow = React.memo(function AudienceProgressRow({
  label,
  total,
  delivered,
  failed,
  pending,
  successRate,
  failRate,
  pendingRate,
  formatNum,
  t,
  borderTop = false,
}: AudienceProgressRowProps) {
  return (
    <div className={`space-y-2 ${borderTop ? 'pt-2 border-t' : ''}`}>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {formatNum(delivered)} / {formatNum(total)} {t('DELIVERED')} ({successRate}%)
        </span>
      </div>

      <div className="w-full h-3 rounded-full bg-secondary flex overflow-hidden">
        <div
          style={{ width: `${successRate}%` }}
          className="bg-green-600 h-full transition-all"
          title={`${t('DELIVERED')}: ${successRate}%`}
        />
        <div
          style={{ width: `${failRate}%` }}
          className="bg-red-600 h-full transition-all"
          title={`${t('FAILED')}: ${failRate}%`}
        />
        <div
          style={{ width: `${pendingRate}%` }}
          className="bg-amber-500 h-full transition-all"
          title={`${t('PENDING')}: ${pendingRate}%`}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
        <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-600" />
          {t('DELIVERED')}: {formatNum(delivered)}
        </span>
        <span className="flex items-center gap-1.5 text-red-700 dark:text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          {t('FAILED')}: {formatNum(failed)}
        </span>
        {pending > 0 && (
          <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {t('PENDING')}: {formatNum(pending)}
          </span>
        )}
      </div>
    </div>
  );
});

export const CommunicationBreakdowns = React.memo(
  function CommunicationBreakdowns({
    data,
    isLoading = false,
    activeStatus,
    onSelectStatus,
  }: CommunicationOverviewStatsProps) {
    const t = useTranslations('USAGE');
    const g = useTranslations('GLOBAL');
    const formatNum = useNumberFormat();

    const recipientWise = React.useMemo(
      () =>
        data?.recipientWise ?? {
          beneficiary: {
            total: 0,
            successful: 0,
            failed: 0,
            pending: 0,
            successRate: 0,
          },
          stakeholder: {
            total: 0,
            successful: 0,
            failed: 0,
            pending: 0,
            successRate: 0,
          },
        },
      [data?.recipientWise],
    );

    const channelWise = React.useMemo(
      () => data?.channelWise ?? {},
      [data?.channelWise],
    );

    const benTotal = recipientWise.beneficiary.total;
    const stkTotal = recipientWise.stakeholder.total;
    const recipientTotal = benTotal + stkTotal;
    const totalLabel = g('TOTAL') || 'TOTAL';

    const { channelKeys, channelSeriesData, channelSuccessData, channelFailData, channelPendingData, channelTotal } = React.useMemo(() => {
      const keys = Object.keys(channelWise).sort();
      const series = keys.map((k) => channelWise[k]?.total || 0);
      return {
        channelKeys: keys,
        channelSeriesData: series,
        channelSuccessData: keys.map((k) => channelWise[k]?.successful || 0),
        channelFailData: keys.map((k) => channelWise[k]?.failed || 0),
        channelPendingData: keys.map((k) => channelWise[k]?.pending || 0),
        channelTotal: series.reduce((sum, v) => sum + v, 0),
      };
    }, [channelWise]);

    const getChannelLabel = React.useCallback(
      (k: string) => {
        const canonical = classifyTransportString(k);
        const key = CHANNEL_LABEL_KEYS[canonical];
        return key ? t(key) : k;
      },
      [t],
    );

    const channelPieData = React.useMemo(() => ({
      series: channelKeys.map((k, idx) => ({
        label: getChannelLabel(k),
        value: channelSeriesData[idx] || 0,
      })),
      colors: channelKeys.map((k, idx) => getChannelColor(k, idx)),
      options: buildDonutOptions(formatNum, totalLabel, channelTotal),
    }), [channelKeys, channelSeriesData, channelTotal, formatNum, getChannelLabel, totalLabel]);

    const barSeries = React.useMemo(() => {
      const hasPending = channelPendingData.some((v) => v > 0);
      return [
        {
          name: t('SUCCESS'),
          data: channelSuccessData,
        },
        {
          name: t('FAILED'),
          data: channelFailData,
        },
        ...(hasPending
          ? [
            {
              name: t('PENDING'),
              data: channelPendingData,
            },
          ]
          : []),
      ];
    }, [channelSuccessData, channelFailData, channelPendingData, t]);

    const barOptions = React.useMemo(() => {
      return {
        colors: [SUCCESS_COLOR, FAILED_COLOR, PENDING_COLOR],
        yaxis: { labels: { formatter: (val: number) => formatNum(val) } },
        tooltip: { y: { formatter: (val: number) => formatNum(val) } },
      };
    }, [formatNum]);

    const audiencePieData = React.useMemo(() => ({
      series: [
        { label: t('BENEFICIARIES'), value: benTotal },
        { label: t('STAKEHOLDERS'), value: stkTotal },
      ],
      colors: ['#4A90E2', '#8B5CF6'],
      options: buildDonutOptions(formatNum, totalLabel, recipientTotal),
    }), [benTotal, stkTotal, recipientTotal, formatNum, t, totalLabel]);

    const benSuccessRate =
      benTotal > 0
        ? Math.round((recipientWise.beneficiary.successful / benTotal) * 100)
        : 0;
    const benFailRate =
      benTotal > 0
        ? Math.round((recipientWise.beneficiary.failed / benTotal) * 100)
        : 0;
    const benPendingRate = Math.max(0, 100 - benSuccessRate - benFailRate);

    const stkSuccessRate =
      stkTotal > 0
        ? Math.round((recipientWise.stakeholder.successful / stkTotal) * 100)
        : 0;
    const stkFailRate =
      stkTotal > 0
        ? Math.round((recipientWise.stakeholder.failed / stkTotal) * 100)
        : 0;
    const stkPendingRate = Math.max(0, 100 - stkSuccessRate - stkFailRate);

    return (
      <div className="space-y-6 w-full max-w-full min-w-0">
        {/* Usage by Transport */}
        <div className="space-y-4 w-full max-w-full min-w-0">
          <h3 className="text-lg font-semibold">{t('USAGE_BY_TRANSPORT')}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full min-w-0">
            <Card className="w-full max-w-full min-w-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('DISTRIBUTION_BY_TRANSPORT')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center w-full max-w-full min-w-0 overflow-hidden">
                {isLoading ? (
                  <TableLoader />
                ) : channelTotal === 0 ? (
                  <NoResult
                    size="small"
                    message={t('NO_CHANNEL_COMMS_RECORDED')}
                  />
                ) : (
                  <div className="w-full max-w-[380px] flex justify-center min-w-0 overflow-hidden">
                    <PieChart
                      custom
                      type="donut"
                      chart={channelPieData}
                      height={300}
                      width="100%"
                      donutSize="70%"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="w-full max-w-full min-w-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('SUCCESS_VS_FAILURE_BY_TRANSPORT')}
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full max-w-full min-w-0 overflow-hidden">
                {isLoading ? (
                  <TableLoader />
                ) : channelKeys.length === 0 ? (
                  <NoResult
                    size="small"
                    message={t('NO_DELIVERY_OUTCOME_RECORDED')}
                  />
                ) : (
                  <ChartColumnStacked
                    series={barSeries}
                    categories={channelKeys.map((k) => getChannelLabel(k))}
                    height={300}
                    width="100%"
                    custom
                    options={barOptions}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Audience Breakdown */}
        <div className="space-y-4 w-full max-w-full min-w-0">
          <h3 className="text-lg font-semibold">{t('AUDIENCE_BREAKDOWN')}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full min-w-0">
            <Card className="w-full max-w-full min-w-0 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('TARGET_AUDIENCE_DISTRIBUTION')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center max-w-full overflow-hidden">
                {isLoading ? (
                  <TableLoader />
                ) : recipientTotal === 0 ? (
                  <NoResult
                    size="small"
                    message={t('NO_RECIPIENT_COMMS_RECORDED')}
                  />
                ) : (
                  <div className="w-full max-w-[380px] flex justify-center">
                    <PieChart
                      custom
                      type="donut"
                      chart={audiencePieData}
                      height={300}
                      width="100%"
                      donutSize="70%"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="max-w-full overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('AUDIENCE_DELIVERY_PROGRESS')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center min-h-[300px] p-4 sm:p-6 space-y-6 max-w-full overflow-hidden">
                {isLoading ? (
                  <TableLoader />
                ) : recipientTotal === 0 ? (
                  <NoResult
                    size="small"
                    message={t('NO_AUDIENCE_DELIVERY_RECORDED')}
                  />
                ) : (
                  <>
                    <AudienceProgressRow
                      label={t('BENEFICIARIES')}
                      total={benTotal}
                      delivered={recipientWise.beneficiary.successful}
                      failed={recipientWise.beneficiary.failed}
                      pending={recipientWise.beneficiary.pending}
                      successRate={benSuccessRate}
                      failRate={benFailRate}
                      pendingRate={benPendingRate}
                      formatNum={formatNum}
                      t={t}
                    />
                    <AudienceProgressRow
                      label={t('STAKEHOLDERS')}
                      total={stkTotal}
                      delivered={recipientWise.stakeholder.successful}
                      failed={recipientWise.stakeholder.failed}
                      pending={recipientWise.stakeholder.pending}
                      successRate={stkSuccessRate}
                      failRate={stkFailRate}
                      pendingRate={stkPendingRate}
                      formatNum={formatNum}
                      t={t}
                      borderTop
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  },
);

CommunicationBreakdowns.displayName = 'CommunicationBreakdowns';

export const CommunicationOverviewStats = React.memo(
  function CommunicationOverviewStats({
    data,
    isLoading,
  }: CommunicationOverviewStatsProps) {
    return (
      <div className="space-y-6 w-full">
        <CommunicationTopKpis data={data} isLoading={isLoading} />
        <CommunicationBreakdowns data={data} isLoading={isLoading} />
      </div>
    );
  },
);

CommunicationOverviewStats.displayName = 'CommunicationOverviewStats';

export default CommunicationOverviewStats;
