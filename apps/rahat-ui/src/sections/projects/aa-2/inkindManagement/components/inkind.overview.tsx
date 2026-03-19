'use client';

import React from 'react';
import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import DynamicPieChart from 'apps/rahat-ui/src/sections/projects/components/dynamicPieChart';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  ArrowDown,
  ArrowUp,
  Archive,
  ArchiveRestore,
  ShoppingBag,
} from 'lucide-react';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useInkindsSummary, useInkindTransactions } from '@rahat-ui/query';

// ─── Helpers ────────────────────────────────────────────────────────────────
const MOVEMENT_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; Icon: React.ElementType }
> = {
  ADD: {
    label: 'Stock In',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    Icon: ArrowUp,
  },
  REMOVE: {
    label: 'Stock Out',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    Icon: ArrowDown,
  },
  LOCK: {
    label: 'Reserved',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    Icon: Archive,
  },
  UNLOCK: {
    label: 'Released',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    Icon: ArchiveRestore,
  },
  REDEEM: {
    label: 'Distributed',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    Icon: ShoppingBag,
  },
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function InkindOverview() {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { data: summaryData } = useInkindsSummary(projectUUID);
  const { data: txData } = useInkindTransactions(projectUUID);

  const inkindItems: any[] = summaryData?.data ?? [];
  const movements: any[] = txData?.data ?? [];

  // ── Stat cards derived from the real list ───────────────────────────────
  const totalItems = inkindItems.length;
  const totalAvailableStock = inkindItems.reduce(
    (s: number, i: any) => s + (i.availableStock ?? 0),
    0,
  );

  // ── Movement stats derived from real transactions ───────────────────────
  const totalAdded = movements
    .filter((m) => m.type === 'ADD')
    .reduce((s, m) => s + (m.quantity ?? 0), 0);

  const totalRemoved = movements
    .filter((m) => m.type === 'REMOVE')
    .reduce((s, m) => s + (m.quantity ?? 0), 0);

  const totalLocked = movements
    .filter((m) => m.type === 'LOCK')
    .reduce((s, m) => s + (m.quantity ?? 0), 0);

  const totalUnlocked = movements
    .filter((m) => m.type === 'UNLOCK')
    .reduce((s, m) => s + (m.quantity ?? 0), 0);

  const totalRedeemed = movements
    .filter((m) => m.type === 'REDEEM')
    .reduce((s, m) => s + (m.quantity ?? 0), 0);

  // ── Donut: stock distribution per inkind item ───────────────────────────
  const stockDistribution = inkindItems.map((i: any) => ({
    label: i.name,
    value: i.availableStock ?? 0,
  }));

  // ── Donut: movement type breakdown ──────────────────────────────────────
  const movementBreakdown = [
    { label: 'Stock In', value: totalAdded },
    { label: 'Stock Out', value: totalRemoved },
    { label: 'Reserved', value: totalLocked },
    { label: 'Distributed', value: totalRedeemed },
  ];

  return (
    <div className="flex flex-col h-full">
      <Heading
        title="Inkind Overview"
        titleStyle="text-lg"
        description="Overview of all in-kind items and stock movements"
      />

      {/* ── Row 1: 4 stat cards ──────────────────────────────────────── */}
      <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 mb-3">
        <DataCard
          className="rounded-sm"
          title="Total In-Kind Types"
          number={String(totalItems)}
          subtitle="Distinct items registered"
        />
        <DataCard
          className="rounded-sm"
          title="Available Stock"
          number={String(totalAvailableStock)}
          subtitle="Units currently available"
        />
        {/* <DataCard
          className="rounded-sm"
          title="Stock In"
          number={String(totalAdded)}
          subtitle="Units added to inventory"
        />
        <DataCard
          className="rounded-sm"
          title="Stock Out"
          number={String(totalRemoved)}
          subtitle="Units removed from inventory"
        /> */}
      </div>

      {/* ── Row 2: 3 stat cards ──────────────────────────────────────── */}
      {/* <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 mb-3">
        <DataCard
          className="rounded-sm"
          title="Reserved"
          number={String(totalLocked)}
          subtitle="Units reserved for groups"
        />
        <DataCard
          className="rounded-sm"
          title="Released"
          number={String(totalUnlocked)}
          subtitle="Units released back to stock"
        />
        <DataCard
          className="rounded-sm"
          title="Distributed"
          number={String(totalRedeemed)}
          subtitle="Units distributed to beneficiaries"
        />
      </div> */}

      {/* ── Row 3: Charts + Flow — fills remaining height ────────────── */}
      <div className="flex flex-col xl:flex-row gap-3 flex-1 min-h-[320px]">
        {/* Stock Distribution Donut */}
        <div className="flex flex-col flex-1 border rounded-sm p-4 min-h-0">
          <h1 className="text-sm font-semibold mb-0.5">Stock Distribution</h1>
          <p className="text-xs text-muted-foreground mb-2">
            Available stock by inkind type
          </p>
          <div className="flex-1 min-h-0">
            <DynamicPieChart
              pieData={stockDistribution}
              colors={['#2A9D90', '#E9C46A', '#F4A261', '#E76F51', '#264653']}
            />
          </div>
        </div>

        {/* Movement Breakdown Donut */}
        {/* <div className="flex flex-col flex-1 border rounded-sm p-4 min-h-0">
          <h1 className="text-sm font-semibold mb-0.5">Movement Breakdown</h1>
          <p className="text-xs text-muted-foreground mb-2">
            Total quantities by movement type
          </p>
          <div className="flex-1 min-h-0">
            <DynamicPieChart
              pieData={movementBreakdown}
              colors={['#2A9D90', '#E53935', '#F59E0B', '#7C3AED']}
            />
          </div>
        </div> */}

        {/* Overall In-Kind Flow */}
        <div className="flex flex-col flex-[2] border rounded-sm p-4 min-h-0">
          <h1 className="text-sm font-semibold mb-0.5">Overall In-Kind Flow</h1>
          <p className="text-xs text-muted-foreground mb-2">
            Stock movement history across all in-kind items
          </p>
          <ScrollArea className="flex-1 min-h-0">
            {movements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No movements recorded yet.
              </p>
            ) : (
              <div className="flex flex-col space-y-2">
                {[...movements].reverse().map((movement: any) => {
                  const config =
                    MOVEMENT_CONFIG[movement.type] ?? MOVEMENT_CONFIG['ADD'];
                  const { Icon } = config;
                  return (
                    <div
                      key={movement.uuid ?? movement.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded-sm border border-gray-100 hover:bg-gray-50 transition-colors"
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
                          <p className="text-sm font-medium leading-none">
                            {movement.inkindName ?? movement.name ?? '—'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {movement.referenceId
                              ? `Ref: ${movement.referenceId}`
                              : 'No reference'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {movement.createdAt
                              ? format(
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
                          {movement.type === 'ADD' || movement.type === 'UNLOCK'
                            ? '+'
                            : '-'}
                          {movement.quantity ?? 0}
                        </span>
                        <Badge
                          variant="outline"
                          className={`rounded-sm text-xs ${config.color} border-current`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
