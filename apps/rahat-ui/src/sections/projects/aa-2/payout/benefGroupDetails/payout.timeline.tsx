'use client';

import { useMemo, useState } from 'react';
import { getPayoutTransactionStatusOptions } from './utils';
import {
  countTimelineEvents,
  filterTimelineEvents,
  normalizeTimelineEvents,
  toCategory,
} from './timeline/timeline.data';
import type { TimelineDateRange } from './timeline/timeline.types';
import { EMPTY_LOGS } from './timeline/timeline.utils';
import { TimelineChartCard, TimelineFilterBar } from './timeline';

type PayoutTimelineProps = {
  payout?: any;
  logs: any[];
  loading?: boolean;
  projectId?: string;
};

export default function PayoutTimeline({
  payout,
  logs = EMPTY_LOGS,
  loading = false,
}: PayoutTimelineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<TimelineDateRange | undefined>();
  const [resetCount, setResetCount] = useState(0);

  const isFsp =
    String(payout?.type ?? '').toUpperCase() === 'FSP' ||
    logs?.some((item) => {
      const s = String(item?.status || item?.['Payout Status'] || '');
      return s.includes('TOKEN_') || s.includes('FIAT_');
    });

  const { events: normalizedEvents, undatedCount } = useMemo(
    () => normalizeTimelineEvents(logs, isFsp),
    [logs, isFsp],
  );

  const statusOptions = useMemo<string[]>(() => {
    const base = getPayoutTransactionStatusOptions(
      payout?.type,
      payout?.extras?.paymentProviderType,
    ) as string[];
    const activeKeys = new Set(normalizedEvents.map((e) => e.status));
    const combined = [...base];
    activeKeys.forEach((k) => {
      if (!combined.includes(k)) combined.push(k);
    });
    return combined;
  }, [payout?.type, payout?.extras?.paymentProviderType, normalizedEvents]);

  const effectiveStatusFilter = statusOptions.includes(statusFilter)
    ? statusFilter
    : 'ALL';

  const filteredEvents = useMemo(
    () =>
      filterTimelineEvents(normalizedEvents, {
        searchQuery,
        status: effectiveStatusFilter,
        dateRange,
      }),
    [normalizedEvents, searchQuery, effectiveStatusFilter, dateRange],
  );

  const statusCounts = useMemo(
    () => countTimelineEvents(filteredEvents),
    [filteredEvents],
  );

  const categoryCounts = useMemo(() => {
    const counts = { success: 0, inProgress: 0, failed: 0 };
    filteredEvents.forEach((ev) => {
      counts[toCategory(ev.status)] += 1;
    });
    return counts;
  }, [filteredEvents]);

  const totalAmount = useMemo(() => {
    return filteredEvents.reduce((sum, ev) => {
      const isDisbursed = isFsp
        ? ev.status === 'FIAT_TRANSACTION_COMPLETED' || ev.status === 'COMPLETED'
        : ev.status === 'COMPLETED' || ev.status === 'PARTIALLY_COMPLETED';
      return isDisbursed ? sum + ev.amount : sum;
    }, 0);
  }, [filteredEvents, isFsp]);

  const isLargeDataset = filteredEvents.length > 500;

  const hasActiveFilters = Boolean(
    searchQuery.trim() || effectiveStatusFilter !== 'ALL' || dateRange?.from,
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDateRange(undefined);
    setResetCount((count) => count + 1);
  };

  return (
    <div className="rounded-sm border border-gray-100 bg-white space-y-2 p-2">
      <TimelineFilterBar
        statusOptions={statusOptions}
        statusFilter={effectiveStatusFilter}
        searchQuery={searchQuery}
        dateRangeKey={resetCount}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onDateChange={setDateRange}
        onClearDate={() => setDateRange(undefined)}
        onReset={handleResetFilters}
      />

      <TimelineChartCard
        events={filteredEvents}
        statusCounts={statusCounts}
        categoryCounts={categoryCounts}
        totalAmount={totalAmount}
        undatedCount={undatedCount}
        isLargeDataset={isLargeDataset}
        isFsp={isFsp}
        loading={loading}
      />
    </div>
  );
}
