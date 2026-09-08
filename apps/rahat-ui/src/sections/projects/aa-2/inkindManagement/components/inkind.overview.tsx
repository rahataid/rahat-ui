'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import {
  CustomPagination,
  DataCard,
  Heading,
  IconLabelBtn,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@rahat-ui/shadcn/src/components/ui/sheet';
import {
  Archive,
  Package,
  Users,
  Calendar,
  Hash,
  Layers,
  CloudDownloadIcon,
} from 'lucide-react';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useInkindsSummary, useInkindTransactions } from '@rahat-ui/query';
import { INKIND_TYPE_LABELS } from '../schemas/inkind.validation';
import {
  exportInkindSummary,
  hasInkindData,
  MOVEMENT_CONFIG,
} from '../utils/utils';
import { formatLabel } from './inkind.allocation.list';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import DynamicPieChart from 'apps/rahat-ui/src/sections/projects/components/dynamicPieChart';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { InkindSummary, Movement } from '../types';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium break-all">{value}</p>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
      {title}
    </p>
  );
}

export default function InkindOverview() {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const handleDateChange = (range: any) => {
    if (range?.from && range?.to) {
      setStartDate(range.from.toISOString());
      setEndDate(range.to.toISOString());
    }
  };

  const handleClearDate = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const { data: summaryData, isPending } = useInkindsSummary(projectUUID, {
    startDate,
    endDate,
  });
  const { data: txData, isFetching: txFetching } = useInkindTransactions(
    projectUUID,
    { page, perPage, startDate, endDate },
  );

  const inkindItemsSummary: InkindSummary = summaryData?.data ?? [];
  const movements: Movement[] = txData?.data ?? [];
  const meta = txData?.response?.meta;
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );

  const tv = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const tg = useTranslations('GLOBAL');
  const formatDate = useDateFormat();
  const formatNum = useNumberFormat();

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const s = inkindItemsSummary;
  const hasData = hasInkindData(s);

  const handleDownloadReport = () => exportInkindSummary(s);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <Heading
          title={tv('INKIND_OVERVIEW')}
          titleStyle="font-medium text-lg"
          description={tv('TRACK_YOUR_IN_KIND_FLOW_HERE')}
        />
        <div className="flex gap-2 items-center">
          <TooltipWrapper
            tip={hasData ? '' : tg('NO_INKIND_DATA_TO_EXPORT')}
          >
            <IconLabelBtn
              Icon={CloudDownloadIcon}
              handleClick={handleDownloadReport}
              name={tg('EXPORT_REPORT')}
              variant="outline"
              disabled={!hasData}
              className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
            />
          </TooltipWrapper>

          <DateRangePicker
            placeholder={tg('PICK_DATE_RANGE')}
            handleDateChange={handleDateChange}
            handleClearDate={handleClearDate}
            type="range"
            className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)] "
          />
        </div>
      </div>
      {isPending || !summaryData ? (
        <SpinnerLoader />
      ) : (
        <>
          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mb-3">
            <DataCard
              className="rounded-sm"
              title={tv('TOTAL_INKIND_TYPES')}
              number={formatNum(
                inkindItemsSummary?.totalInkindTypes
                  ? inkindItemsSummary.totalInkindTypes
                  : 0,
              )}
              subtitle={tv('DISTINCT_ITEMS_REGISTERED')}
            />
            <DataCard
              className="rounded-sm"
              title={tv('AVAILABLE_STOCK')}
              number={formatNum(
                inkindItemsSummary?.totalAvailableStock
                  ? inkindItemsSummary.totalAvailableStock
                  : 0,
              )}
              subtitle={tv('UNITS_CURRENTLY_AVAILABLE')}
            />
            <DataCard
              className="rounded-sm"
              title={tv('REDEEMED_STOCK')}
              number={formatNum(
                inkindItemsSummary?.totalRedeemedStock
                  ? inkindItemsSummary.totalRedeemedStock
                  : 0,
              )}
              subtitle={tv('UNITS_CURRENTLY_REDEEMED')}
            />
          </div>

          {/* Row 1: Redemption Type + Redemption Status */}
          <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-3 mb-3">
            <div className="border rounded-sm p-4">
              <h3 className="text-sm font-medium mb-3">{tv('REDEMPTION_TYPE')}</h3>
              <div className="w-full h-48">
                <DynamicPieChart
                  pieData={[
                    {
                      label: tv('PRE_DEFINED_BENEFICIARY_LIST'),
                      value:
                        inkindItemsSummary?.chartData?.redemptionType
                          ?.predefined || 0,
                    },
                    {
                      label: tv('WALK_IN_BENEFICIARY_LIST'),
                      value:
                        inkindItemsSummary?.chartData?.redemptionType?.walkIn ||
                        0,
                    },
                  ]}
                  colors={['#F4A462', '#2A9D90']}
                  options={{
                tooltip: {
                  fillSeriesColor: true,
                  y: { formatter: (val: number) => formatNum(val) },
                },
              }}
            />
              </div>
            </div>

            <div className="border rounded-sm p-4">
              <h3 className="text-sm font-medium mb-3">{tv('REDEMPTION_STATUS')}</h3>
              <div className="w-full h-48">
                <DynamicPieChart
                  pieData={[
                    {
                      label: tv('REDEEMED'),
                      value: inkindItemsSummary?.totalRedeemedStock || 0,
                    },
                    {
                      label: tv('NOT_REDEEMED'),
                      value: Math.max(
                        0,
                        (inkindItemsSummary?.totalAssignedStock || 0) -
                          (inkindItemsSummary?.totalRedeemedStock || 0),
                      ),
                    },
                  ]}
                  colors={['#FFA500', '#10B981']}
                  options={{
                tooltip: {
                  fillSeriesColor: true,
                  y: { formatter: (val: number) => formatNum(val) },
                },
              }}
            />
              </div>
            </div>
          </div>

          {/* Row 2 & 3: Column 1 (OTP Status + Skip Reasons) + Column 2 (Overall Inkind Flow) */}
          <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-3 mb-3">
            {/* Left Column: OTP Status + OTP Skip Reasons */}
            <div className="flex flex-col gap-3">
              <div className="border rounded-sm p-4">
                <h3 className="text-sm font-medium mb-3">{tv('OTP_STATUS')}</h3>
                <div className="w-full h-48">
                  <DynamicPieChart
                    pieData={[
                      {
                        label: tv('SKIPPED'),
                        value:
                          inkindItemsSummary?.chartData?.otpStatus?.skipped ||
                          0,
                      },
                      {
                        label: tv('NOT_SKIPPED'),
                        value:
                          inkindItemsSummary?.chartData?.otpStatus
                            ?.notSkipped || 0,
                      },
                    ]}
                    colors={['#FFA500', '#10B981']}
                    options={{
                  tooltip: {
                    fillSeriesColor: true,
                    y: { formatter: (val: number) => formatNum(val) },
                  },
                }}
              />
                </div>
              </div>

              <div className="border rounded-sm p-4">
                <h3 className="text-sm font-medium mb-3">{tv('OTP_SKIP_REASONS')}</h3>
                {inkindItemsSummary?.chartData?.otpSkipReasons &&
                inkindItemsSummary.chartData.otpSkipReasons.length > 0 ? (
                  (() => {
                    const reasons: { reason: string; count: number }[] = [
                      ...inkindItemsSummary.chartData.otpSkipReasons,
                    ].sort((a, b) => b.count - a.count);
                    const max = reasons[0].count;
                    return (
                      <TooltipProvider>
                        <ScrollArea className="h-48">
                          <div className="space-y-2 pr-2">
                            {reasons.map((r, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-4 text-xs text-muted-foreground shrink-0 text-right">
                                  {formatNum(i + 1)}
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="w-32 shrink-0 truncate text-xs cursor-default">
                                      {r.reason}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-xs whitespace-normal"
                                  >
                                    {r.reason}
                                  </TooltipContent>
                                </Tooltip>
                                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-indigo-500"
                                    style={{
                                      width: `${(r.count / max) * 100}%`,
                                    }}
                                  />
                                </div>
                                <div className="text-xs font-medium w-6 shrink-0 text-right">
                                  {formatNum(r.count)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TooltipProvider>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                    {tg('NO_DATA_AVAILABLE')}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Overall Inkind Flow */}
            <div className="border rounded-sm p-4 flex flex-col">
              <div className="flex items-start justify-between mb-0.5">
                <h1 className="text-lg font-medium">{tv('OVERALL_INKIND_FLOW')}</h1>
              </div>
              {movements.length !== 0 && (
                <p className="text-xs text-muted-foreground mb-3">
                  {tv('CLICK_ON_ANY_LOGS_TO_VIEW')}
                </p>
              )}
              <div className="relative flex-1 min-h-[150px]">
                {txFetching && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-sm">
                    <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                )}
                <ScrollArea className="flex-1 min-h-[120px] max-h-[40vh] overflow-auto items-center justify-center">
                  {movements.length === 0 ? (
                    <p className="text-sm text-muted-foreground align-center justify-center text-center py-6">
                      {tv('NO_RECORDS_AVAILABLE')}
                    </p>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      {sortedMovements.map((movement) => {
                        const config =
                          MOVEMENT_CONFIG[movement.type] ??
                          MOVEMENT_CONFIG['ADD'];
                        const { Icon } = config;
                        const isPositive =
                          movement.type === 'ADD' || movement.type === 'UNLOCK';

                        return (
                          <button
                            key={movement.uuid}
                            onClick={() => setSelectedMovement(movement)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-sm border border-gray-100 hover:bg-gray-50 transition-colors text-left w-full"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${config.bgColor}`}
                              >
                                <Icon
                                  size={15}
                                  className={config.color}
                                  strokeWidth={2}
                                />
                              </div>
                              <div>
                                <div className="flex flex-row items-center gap-2">
                                  <TruncatedCell
                                    text={movement.inkind?.name || '—'}
                                    maxLength={30}
                                  />
                                  <Badge className="bg-gray-200 text-gray-600">
                                    {movement.inkind?.type
                                      ? tg(movement.inkind.type)
                                      : ''}
                                  </Badge>
                                </div>
                                {movement.groupInkind && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {movement.groupInkind?.group?.name || '-'}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {movement.createdAt
                                    ? formatDate(
                                        new Date(movement.createdAt),
                                        'dd MMM yyyy, HH:mm',
                                      )
                                    : '—'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`text-sm font-semibold ${config.color}`}
                              >
                                {isPositive ? '+' : '-'}
                                {formatNum(movement.quantity ?? 0)}
                              </span>
                              <Badge
                                variant="outline"
                                className={`rounded-sm text-xs ${config.color} border-current`}
                              >
                                {tv(config.labelKey)}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </div>
              <CustomPagination
                currentPage={page}
                handleNextPage={() =>
                  setPage((p) => Math.min(meta?.lastPage ?? p, p + 1))
                }
                handlePrevPage={() => setPage((p) => Math.max(1, p - 1))}
                handlePageSizeChange={(size) => {
                  setPerPage(size as number);
                  setPage(1);
                }}
                meta={{
                  total: meta?.total ?? 0,
                  currentPage: page,
                  lastPage: meta?.lastPage ?? 1,
                  perPage,
                  next: meta?.next ?? null,
                  prev: meta?.prev ?? null,
                }}
                perPage={perPage}
              />
            </div>
          </div>

          <Sheet
            open={!!selectedMovement}
            onOpenChange={(o) => !o && setSelectedMovement(null)}
          >
            <SheetContent className="w-[400px] sm:w-[460px] overflow-y-auto">
              {selectedMovement &&
                (() => {
                  const config =
                    MOVEMENT_CONFIG[selectedMovement.type] ??
                    MOVEMENT_CONFIG['ADD'];
                  const { Icon } = config;
                  const isPositive =
                    selectedMovement.type === 'ADD' ||
                    selectedMovement.type === 'UNLOCK';

                  return (
                    <>
                      <SheetHeader className="mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${config.bgColor}`}
                          >
                            <Icon
                              size={18}
                              className={config.color}
                              strokeWidth={2}
                            />
                          </div>
                          <div>
                            <SheetTitle className="text-base">
                              {tv('TRANSACTION_DETAILS')}
                            </SheetTitle>
                            <Badge
                              variant="outline"
                              className={`mt-1 rounded-sm text-xs ${config.color} border-current`}
                            >
                              {tv(config.labelKey)}
                            </Badge>
                          </div>
                        </div>
                      </SheetHeader>

                      <div className="mb-5">
                        <SectionTitle title={tv('TRANSACTION_DETAILS')} />
                        <div className="border rounded-md px-3">
                          <DetailRow
                            icon={Hash}
                            label={tv('TRANSACTION_ID')}
                            value={selectedMovement.uuid}
                          />
                          <DetailRow
                            icon={Calendar}
                            label={tv('DATE_TIME')}
                            value={
                              selectedMovement.createdAt
                                ? formatDate(
                                    new Date(selectedMovement.createdAt),
                                    'dd MMM yyyy, HH:mm:ss',
                                  )
                                : '—'
                            }
                          />
                          <DetailRow
                            icon={Layers}
                            label={tv('QUANTITY')}
                            value={
                              <span className={`font-bold ${config.color}`}>
                                {isPositive ? '+' : '-'}
                                {formatNum(selectedMovement.quantity)}
                              </span>
                            }
                          />
                        </div>
                      </div>

                  {selectedMovement.inkind && (
                    <div className="mb-5">
                      <SectionTitle title={tv('INKIND_ITEM')} />
                      <div className="border rounded-md px-3">
                        <DetailRow
                          icon={Package}
                          label={tg('NAME')}
                          value={selectedMovement.inkind.name}
                        />
                        <DetailRow
                          icon={Layers}
                          label={tg('TYPE')}
                          value={
                            <Badge className="bg-gray-200 text-gray-600">
                              {tg(selectedMovement.inkind.type)}
                            </Badge>
                          }
                        />
                        <DetailRow
                          icon={Archive}
                          label={tv('AVAILABLE_STOCK')}
                          value={
                            <span className="text-primary font-bold">
                              {formatNum(selectedMovement.inkind.availableStock)}
                            </span>
                          }
                        />
                        {selectedMovement.inkind.description && (
                          <DetailRow
                            icon={Hash}
                            label={tg('DESCRIPTION')}
                            value={selectedMovement.inkind.description}
                          />
                        )}
                      </div>
                    </div>
                  )}

                      {selectedMovement.groupInkind && (
                        <div className="mb-5">
                          <SectionTitle title={tv('GROUP_ALLOCATION')} />
                          <div className="border rounded-md px-3">
                            <DetailRow
                              icon={Users}
                              label={tv('GROUP')}
                              value={
                                <span className="text-primary font-bold">
                                  {selectedMovement.groupInkind.group?.name ??
                                    '—'}
                                </span>
                              }
                            />
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}
