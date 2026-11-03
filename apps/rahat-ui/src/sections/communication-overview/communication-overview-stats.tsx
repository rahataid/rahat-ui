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
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import {
  CommunicationOverviewData,
  classifyTransportString,
  capitalizeFirstLetter,
  TransportDeliveryCounts,
  GroupTransportStats,
  ChannelWiseStats,
} from '@rahat-ui/query';
import {
  PieChart,
  ChartColumnStacked,
} from '@rahat-ui/shadcn/src/components/charts';
import {
  Radio,
  CheckCircle,
  Megaphone,
} from 'lucide-react';
import { CommunicationChannelIcon } from '../projects/aa-2/communications/components/communication-channel-icon';

const CHANNEL_COLORS: Record<string, string> = {
  SMS: '#4A90E2',
  VOICE: '#FFA726',
  EMAIL: '#00b67a',
  WHATSAPP: '#25D366',
};

const SUCCESS_COLOR = '#16A34A';
const FAILED_COLOR = '#DC2626';
const PENDING_COLOR = '#F59E0B';

const FALLBACK_COLORS = [
  '#4A90E2',
  '#00b67a',
  '#FFA726',
  '#25D366',
  '#0284C7',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#F97316',
  '#14B8A6',
];

const DEFAULT_OVERALL = {
  totalCommunications: 0,
  totalCampaigns: 0,
  successful: 0,
  failed: 0,
  pending: 0,
  totalRecipients: 0,
  successRate: 0,
};

const DEFAULT_RECIPIENT_WISE = {
  beneficiary: { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 },
  stakeholder: { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 },
};

const EMPTY_CHANNEL_WISE: ChannelWiseStats = {};

type ApexFormatterOpts = {
  seriesIndex?: number;
  w?: {
    globals?: {
      series?: number[];
      seriesTotals?: number[];
    };
    config?: {
      series?: number[];
    };
  };
};

export type CommunicationOverviewStatsProps = {
  data?: CommunicationOverviewData;
  isLoading?: boolean;
  activeStatus?: string;
  onSelectStatus?: (status?: string) => void;
  projectName?: string;
  activeChannel?: string;
  activeRecipient?: string;
};

function buildDonutOptions(
  formatNum: (v: number | string) => string,
  totalLabel: string,
  total: number,
) {
  return {
    dataLabels: {
      enabled: true,
      formatter: (_val: number | string, opts?: ApexFormatterOpts) => {
        const seriesIdx = opts?.seriesIndex ?? 0;
        const num =
          opts?.w?.globals?.series?.[seriesIdx] ??
          opts?.w?.config?.series?.[seriesIdx];
        if (num === undefined || num === null || num === 0) return '';
        return formatNum(num);
      },
    },
    tooltip: {
      fillSeriesColor: true,
      y: {
        formatter: (val: number, opts?: ApexFormatterOpts) => {
          const sum =
            opts?.w?.globals?.seriesTotals?.reduce(
              (a: number, b: number) => a + b,
              0,
            ) || total;
          const pct = sum > 0 ? ((val / sum) * 100).toFixed(1) : '0';
          return `${formatNum(pct)}%`;
        },
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            value: {
              formatter: (val: number | string, opts?: ApexFormatterOpts) => {
                const num = Number(val);
                const sum =
                  opts?.w?.globals?.seriesTotals?.reduce(
                    (a: number, b: number) => a + b,
                    0,
                  ) || total;
                const pct = sum > 0 ? ((num / sum) * 100).toFixed(1) : '0';
                return `${formatNum(pct)}%`;
              },
            },
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
  const upper = channel.toUpperCase().trim();
  if (CHANNEL_COLORS[upper]) return CHANNEL_COLORS[upper];
  if (upper.includes('WHATSAPP')) return '#25D366';
  if (upper.includes('PRABHU')) return '#0284C7';
  const canonical = classifyTransportString(channel);
  if (CHANNEL_COLORS[canonical] && index === 0) return CHANNEL_COLORS[canonical];
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export const CommunicationTopKpis = React.memo(
  function CommunicationTopKpis({
    data,
    isLoading = false,
    activeStatus,
    onSelectStatus,
    projectName,
  }: CommunicationOverviewStatsProps) {
    const t = useTranslations('USAGE');
    const formatNum = useNumberFormat();

    const overall = data?.overall ?? DEFAULT_OVERALL;

    const totalRecipients =
      overall.totalRecipients > 0
        ? overall.totalRecipients
        : overall.successful + overall.failed + overall.pending;

    const deliveryRatio = `${formatNum(overall.successful)}/${formatNum(
      totalRecipients,
    )}`;

    const pendingText =
      overall.pending > 0
        ? ` · ${formatNum(overall.pending)} ${capitalizeFirstLetter(t('PENDING')) || 'Pending'}`
        : '';
    const subtitleText = `${formatNum(overall.successful)} ${capitalizeFirstLetter(t('DELIVERED')) || 'Delivered'} · ${formatNum(overall.failed)} ${capitalizeFirstLetter(t('FAILED')) || 'Failed'}${pendingText}`;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-full">
        <div
          onClick={() => onSelectStatus?.(undefined)}
          className={`cursor-pointer transition-all rounded-lg ${
            activeStatus ? 'hover:opacity-90' : ''
          }`}
          title={t('VIEW_ALL_COMMUNICATIONS')}
        >
          <DataCard
            title={t('TOTAL_BROADCASTS')}
            number={formatNum(overall.totalCommunications)}
            Icon={Radio}
            loading={isLoading}
            subtitle={projectName || t('ALL_PROJECTS')}
            truncate={false}
          />
        </div>

        <div
          onClick={() =>
            onSelectStatus?.(
              activeStatus === 'COMPLETED' ? undefined : 'COMPLETED',
            )
          }
          className={`cursor-pointer transition-all rounded-lg ${
            activeStatus === 'COMPLETED'
              ? 'ring-2 ring-green-600'
              : 'hover:opacity-90'
          }`}
          title={
            activeStatus === 'COMPLETED'
              ? t('CLEAR_FILTERS') || 'Clear filter'
              : t('FILTER_COMPLETED_COMMUNICATIONS')
          }
        >
          <DataCard
            title={t('DELIVERY_STATUS') || 'Delivery Status'}
            number={
              <span
                className={
                  deliveryRatio.length > 11
                    ? 'text-xl sm:text-2xl xl:text-3xl whitespace-nowrap'
                    : 'text-2xl sm:text-3xl whitespace-nowrap'
                }
              >
                {deliveryRatio}
              </span>
            }
            Icon={CheckCircle}
            loading={isLoading}
            subtitle={subtitleText}
            iconStyle="text-green-600 bg-green-100"
            truncate={false}
          />
        </div>

        <div
          onClick={() => onSelectStatus?.(undefined)}
          className={`cursor-pointer transition-all rounded-lg ${
            activeStatus ? 'hover:opacity-90' : ''
          }`}
          title={t('VIEW_ALL_COMMUNICATIONS')}
        >
          <DataCard
            title={t('TOTAL_CAMPAIGNS') || 'Total Campaigns'}
            number={formatNum(overall.totalCampaigns ?? overall.totalCommunications)}
            Icon={Megaphone}
            loading={isLoading}
            subtitle={projectName || t('ALL_PROJECTS')}
            iconStyle="text-purple-600 bg-purple-100"
            truncate={false}
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
  formatNum: (v: number | string) => string;
  t: any;
  borderTop?: boolean;
  channelBreakdown?: Record<string, TransportDeliveryCounts>;
  activeChannel?: string;
};

const AudienceProgressRow = React.memo(function AudienceProgressRow({
  label,
  total,
  delivered,
  failed,
  pending,
  formatNum,
  t,
  borderTop = false,
  channelBreakdown,
  activeChannel,
}: AudienceProgressRowProps) {
  const deliveredLabel = capitalizeFirstLetter(t('DELIVERED')) || 'Delivered';
  const failedLabel = capitalizeFirstLetter(t('FAILED')) || 'Failed';
  const pendingLabel = capitalizeFirstLetter(t('PENDING')) || 'Pending';

  const successPct = total > 0 ? (delivered / total) * 100 : 0;
  const failPct = total > 0 ? (failed / total) * 100 : 0;
  const pendingPct = total > 0 ? (pending / total) * 100 : 0;
  const pctFormatted =
    successPct % 1 === 0 ? successPct.toFixed(0) : successPct.toFixed(1);
  const displayPct = formatNum(pctFormatted);

  const targetChannel =
    activeChannel && activeChannel !== 'all'
      ? classifyTransportString(activeChannel)
      : undefined;

  return (
    <div className={`space-y-2.5 ${borderTop ? 'pt-4 border-t' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
        <span className="font-semibold text-foreground text-sm tracking-tight">{label}</span>
        <span className="text-muted-foreground tabular-nums font-medium">
          <span className="text-foreground font-semibold">{formatNum(delivered)}</span> / {formatNum(total)} {deliveredLabel} ({displayPct}%)
        </span>
      </div>

      <div className="w-full h-3 rounded-full bg-secondary/80 flex overflow-hidden">
        {successPct > 0 && (
          <div
            style={{ width: `${successPct}%` }}
            className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-300"
            title={`${deliveredLabel}: ${formatNum(delivered)} (${displayPct}%)`}
          />
        )}
        {failPct > 0 && (
          <div
            style={{ width: `${failPct}%` }}
            className="bg-rose-600 dark:bg-rose-500 h-full transition-all duration-300 min-w-[3px]"
            title={`${failedLabel}: ${formatNum(failed)}`}
          />
        )}
        {pendingPct > 0 && (
          <div
            style={{ width: `${pendingPct}%` }}
            className="bg-amber-500 dark:bg-amber-400 h-full transition-all duration-300 min-w-[3px]"
            title={`${pendingLabel}: ${formatNum(pending)}`}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-1 gap-x-3 text-xs text-muted-foreground pt-0.5">
        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          <span>{deliveredLabel}:</span>
          <span className="tabular-nums font-semibold">{formatNum(delivered)}</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
            <span>{failedLabel}:</span>
            <span className="tabular-nums font-semibold">{formatNum(failed)}</span>
          </span>
          {pending > 0 && (
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>{pendingLabel}:</span>
              <span className="tabular-nums font-semibold">{formatNum(pending)}</span>
            </span>
          )}
        </div>
      </div>

      {channelBreakdown && Object.keys(channelBreakdown).length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {Object.entries(channelBreakdown)
            .filter(([chName]) => !targetChannel || classifyTransportString(chName) === targetChannel)
            .map(([chName, c]) => {
              const chDelivered = Number(c?.SUCCESS || 0);
              const chFailed = Number(c?.FAIL || 0);
              const chPending = Number((c?.PENDING || 0) + (c?.SCHEDULED || 0));
              const chTotal = Number(
                c?.TOTAL || chDelivered + chFailed + chPending,
              );
              if (chTotal === 0) return null;

              return (
                <span
                  key={chName}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted/60 hover:bg-muted text-foreground border border-border/70 transition-colors shadow-xs whitespace-nowrap"
                >
                  <CommunicationChannelIcon
                    channel={chName}
                    className="h-3.5 w-3.5 text-muted-foreground shrink-0"
                  />
                  <span className="font-semibold">
                    {translateValue(t, chName, { fallback: chName })}:
                  </span>
                  <span className="tabular-nums font-mono text-muted-foreground">
                    {formatNum(chDelivered)}/{formatNum(chTotal)}
                  </span>
                  {chFailed > 0 && (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px] bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                      ({formatNum(chFailed)} {t('FAILED')?.toLowerCase() || 'failed'})
                    </span>
                  )}
                  {chPending > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px] bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                      ({formatNum(chPending)} {t('PENDING')?.toLowerCase() || 'pending'})
                    </span>
                  )}
                </span>
              );
            })}
        </div>
      )}
    </div>
  );
});

export const CommunicationBreakdowns = React.memo(
  function CommunicationBreakdowns({
    data,
    isLoading = false,
    activeChannel,
    activeRecipient,
  }: CommunicationOverviewStatsProps) {
    const t = useTranslations('USAGE');
    const g = useTranslations('GLOBAL');
    const formatNum = useNumberFormat();

    const showBeneficiary =
      !activeRecipient ||
      activeRecipient === 'all' ||
      activeRecipient.toUpperCase().includes('BENEFICIARY');

    const showStakeholder =
      !activeRecipient ||
      activeRecipient === 'all' ||
      activeRecipient.toUpperCase().includes('STAKEHOLDER');

    const recipientWise = data?.recipientWise ?? DEFAULT_RECIPIENT_WISE;
    const channelWise: ChannelWiseStats = data?.channelWise ?? EMPTY_CHANNEL_WISE;
    const rawGroupStats = data?.rawGroupStats as GroupTransportStats | undefined;

    const benTotal = recipientWise.beneficiary.total;
    const stkTotal = recipientWise.stakeholder.total;
    const recipientTotal = benTotal + stkTotal;
    const totalLabel = g('TOTAL') || 'TOTAL';

    const { channelKeys, channelSeriesData, channelSuccessData, channelFailData, channelPendingData, channelTotal } = React.useMemo(() => {
      const keys = Object.keys(channelWise).sort(
        (a, b) => (channelWise[b]?.total || 0) - (channelWise[a]?.total || 0),
      );
      const seriesData: number[] = [];
      const successData: number[] = [];
      const failData: number[] = [];
      const pendingData: number[] = [];
      let total = 0;

      for (const k of keys) {
        const item = channelWise[k];
        const tCount = item?.total || 0;
        seriesData.push(tCount);
        successData.push(item?.successful || 0);
        failData.push(item?.failed || 0);
        pendingData.push(item?.pending || 0);
        total += tCount;
      }

      return {
        channelKeys: keys,
        channelSeriesData: seriesData,
        channelSuccessData: successData,
        channelFailData: failData,
        channelPendingData: pendingData,
        channelTotal: total,
      };
    }, [channelWise]);

    const channelPieData = React.useMemo(
      () => ({
        series: channelKeys.map((k, idx) => ({
          label: translateValue(t, k, { fallback: k }),
          value: channelSeriesData[idx] || 0,
        })),
        colors: channelKeys.map((k, idx) => getChannelColor(k, idx)),
        options: buildDonutOptions(formatNum, totalLabel, channelTotal),
      }),
      [channelKeys, channelSeriesData, channelTotal, formatNum, totalLabel, t],
    );

    const barSeries = React.useMemo(() => {
      const hasPending = channelPendingData.some((v) => v > 0);
      return [
        {
          name: t('SUCCESS'),
          data: channelSuccessData,
        },
        ...(hasPending
          ? [
              {
                name: t('PENDING'),
                data: channelPendingData,
              },
            ]
          : []),
        {
          name: t('FAILED'),
          data: channelFailData,
        },
      ];
    }, [channelSuccessData, channelFailData, channelPendingData, t]);

    const barOptions = React.useMemo(() => {
      const hasPending = channelPendingData.some((v) => v > 0);
      return {
        colors: hasPending
          ? [SUCCESS_COLOR, PENDING_COLOR, FAILED_COLOR]
          : [SUCCESS_COLOR, FAILED_COLOR],
        yaxis: { labels: { formatter: (val: number) => formatNum(val) } },
        tooltip: { y: { formatter: (val: number) => formatNum(val) } },
      };
    }, [channelPendingData, formatNum]);

    const audiencePieData = React.useMemo(() => {
      const series = [
        ...(showBeneficiary ? [{ label: t('BENEFICIARIES'), value: benTotal }] : []),
        ...(showStakeholder ? [{ label: t('STAKEHOLDERS'), value: stkTotal }] : []),
      ];
      const colors = [
        ...(showBeneficiary ? ['#4A90E2'] : []),
        ...(showStakeholder ? ['#8B5CF6'] : []),
      ];
      const total = (showBeneficiary ? benTotal : 0) + (showStakeholder ? stkTotal : 0);

      return {
        series,
        colors,
        options: buildDonutOptions(formatNum, totalLabel, total),
      };
    }, [showBeneficiary, showStakeholder, benTotal, stkTotal, formatNum, t, totalLabel]);

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
                    categories={channelKeys.map((k) =>
                      translateValue(t, k, { fallback: k }),
                    )}
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
                    {showBeneficiary && (
                      <AudienceProgressRow
                        label={t('BENEFICIARIES')}
                        total={benTotal}
                        delivered={recipientWise.beneficiary.successful}
                        failed={recipientWise.beneficiary.failed}
                        pending={recipientWise.beneficiary.pending}
                        formatNum={formatNum}
                        t={t}
                        channelBreakdown={rawGroupStats?.beneficiary}
                        activeChannel={activeChannel}
                      />
                    )}
                    {showStakeholder && (
                      <AudienceProgressRow
                        label={t('STAKEHOLDERS')}
                        total={stkTotal}
                        delivered={recipientWise.stakeholder.successful}
                        failed={recipientWise.stakeholder.failed}
                        pending={recipientWise.stakeholder.pending}
                        formatNum={formatNum}
                        t={t}
                        borderTop={showBeneficiary}
                        channelBreakdown={rawGroupStats?.stakeholder}
                        activeChannel={activeChannel}
                      />
                    )}
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
    activeStatus,
    onSelectStatus,
    projectName,
    activeChannel,
    activeRecipient,
  }: CommunicationOverviewStatsProps) {
    return (
      <div className="space-y-6 w-full">
        <CommunicationTopKpis
          data={data}
          isLoading={isLoading}
          activeStatus={activeStatus}
          onSelectStatus={onSelectStatus}
          projectName={projectName}
        />
        <CommunicationBreakdowns
          data={data}
          isLoading={isLoading}
          activeStatus={activeStatus}
          onSelectStatus={onSelectStatus}
          projectName={projectName}
          activeChannel={activeChannel}
          activeRecipient={activeRecipient}
        />
      </div>
    );
  },
);

CommunicationOverviewStats.displayName = 'CommunicationOverviewStats';

export default CommunicationOverviewStats;
