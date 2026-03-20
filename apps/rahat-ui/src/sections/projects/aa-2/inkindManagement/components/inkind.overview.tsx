'use client';

import React, { useState } from 'react';
import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@rahat-ui/shadcn/src/components/ui/sheet';
import {
  ArrowDown,
  ArrowUp,
  Archive,
  ArchiveRestore,
  ShoppingBag,
  Package,
  Users,
  Calendar,
  Hash,
  Layers,
} from 'lucide-react';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useInkindsSummary, useInkindTransactions } from '@rahat-ui/query';

// ─── Types ───────────────────────────────────────────────────────────────────
type Movement = {
  id: number;
  uuid: string;
  inkindId: string;
  quantity: number;
  type: string;
  groupInkindId: string | null;
  redemptionId: string | null;
  createdAt: string;
  inkind: {
    id: number;
    uuid: string;
    name: string;
    type: string;
    description: string;
    availableStock: number;
    createdAt: string;
  } | null;
  groupInkind: {
    id: number;
    uuid: string;
    groupId: string;
    inkindId: string;
    quantityAllocated: number;
    quantityRedeemed: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  redemption: unknown | null;
};

// ─── Config ──────────────────────────────────────────────────────────────────
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

// ─── Detail row helper ───────────────────────────────────────────────────────
function DetailRow({
  icon: Icon,
  label,
  value,
  valueClass = '',
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-sm font-medium break-all ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InkindOverview() {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { data: summaryData } = useInkindsSummary(projectUUID);
  const { data: txData } = useInkindTransactions(projectUUID);

  const inkindItems: any[] = summaryData?.data ?? [];
  const movements: Movement[] = txData?.data ?? [];

  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );

  // ── Stat cards ─────────────────────────────────────────────────────────────
  const totalItems = inkindItems.length;
  const totalAvailableStock = inkindItems.reduce(
    (s: number, i: any) => s + (i.availableStock ?? 0),
    0,
  );

  return (
    <div className="flex flex-col h-full">
      <Heading
        title="Inkind Overview"
        titleStyle="text-lg"
        description="Overview of all in-kind items and stock movements"
      />

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
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
      </div>

      {/* ── Movement list ─────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-[2] border rounded-sm p-4 min-h-0">
        <h1 className="text-sm font-semibold mb-0.5">Overall Inkind Flow</h1>
        <p className="text-xs text-muted-foreground mb-3">
          Click on any movement to view details
        </p>
        <ScrollArea className="flex-1 min-h-0">
          {movements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No movements recorded yet.
            </p>
          ) : (
            <div className="flex flex-col space-y-2">
              {[...movements]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((movement) => {
                  const config =
                    MOVEMENT_CONFIG[movement.type] ?? MOVEMENT_CONFIG['ADD'];
                  const { Icon } = config;
                  const inkindName = movement.inkind?.name ?? '—';
                  const isPositive =
                    movement.type === 'ADD' || movement.type === 'UNLOCK';

                  return (
                    <button
                      key={movement.uuid}
                      onClick={() => setSelectedMovement(movement)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-sm border border-gray-100 hover:bg-gray-50 hover:border-primary/30 transition-colors text-left w-full"
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
                            {inkindName}
                          </p>
                          {movement.groupInkind && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Group ID:{' '}
                              {movement.groupInkind.groupId.slice(0, 8)}…
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
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
                          {isPositive ? '+' : '-'}
                          {movement.quantity ?? 0}
                        </span>
                        <Badge
                          variant="outline"
                          className={`rounded-sm text-xs ${config.color} border-current`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ── Detail sheet ──────────────────────────────────────────────────── */}
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
                          Transaction Details
                        </SheetTitle>
                        <Badge
                          variant="outline"
                          className={`mt-1 rounded-sm text-xs ${config.color} border-current`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </SheetHeader>

                  {/* ── Transaction info ─────────────────────────────────── */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      Transaction
                    </p>
                    <div className="border rounded-md px-3">
                      <DetailRow
                        icon={Hash}
                        label="Transaction ID"
                        value={selectedMovement.uuid}
                      />
                      <DetailRow
                        icon={Calendar}
                        label="Date & Time"
                        value={
                          selectedMovement.createdAt
                            ? format(
                                new Date(selectedMovement.createdAt),
                                'dd MMM yyyy, HH:mm:ss',
                              )
                            : '—'
                        }
                      />
                      <DetailRow
                        icon={Layers}
                        label="Quantity"
                        value={
                          <span className={`font-bold ${config.color}`}>
                            {isPositive ? '+' : '-'}
                            {selectedMovement.quantity}
                          </span>
                        }
                      />
                    </div>
                  </div>

                  {/* ── In-Kind item ─────────────────────────────────────── */}
                  {selectedMovement.inkind && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        In-Kind Item
                      </p>
                      <div className="border rounded-md px-3">
                        <DetailRow
                          icon={Package}
                          label="Name"
                          value={selectedMovement.inkind.name}
                        />
                        <DetailRow
                          icon={Layers}
                          label="Type"
                          value={
                            <Badge
                              variant="secondary"
                              className="rounded-sm text-xs"
                            >
                              {selectedMovement.inkind.type}
                            </Badge>
                          }
                        />
                        <DetailRow
                          icon={Archive}
                          label="Available Stock"
                          value={
                            <span className="text-primary font-bold">
                              {selectedMovement.inkind.availableStock}
                            </span>
                          }
                        />
                        {selectedMovement.inkind.description && (
                          <DetailRow
                            icon={Hash}
                            label="Description"
                            value={selectedMovement.inkind.description}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Group allocation ─────────────────────────────────── */}
                  {selectedMovement.groupInkind && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                        Group Allocation
                      </p>
                      <div className="border rounded-md px-3">
                        <DetailRow
                          icon={Users}
                          label="Group ID"
                          value={selectedMovement.groupInkind.groupId}
                        />
                        <DetailRow
                          icon={Layers}
                          label="Quantity Allocated"
                          value={
                            <span className="text-primary font-bold">
                              {selectedMovement.groupInkind.quantityAllocated}
                            </span>
                          }
                        />
                        <DetailRow
                          icon={ShoppingBag}
                          label="Quantity Redeemed"
                          value={
                            <span
                              className={
                                selectedMovement.groupInkind.quantityRedeemed >
                                0
                                  ? 'text-purple-600 font-bold'
                                  : 'text-muted-foreground'
                              }
                            >
                              {selectedMovement.groupInkind.quantityRedeemed}
                            </span>
                          }
                        />
                        <DetailRow
                          icon={Calendar}
                          label="Allocated At"
                          value={
                            selectedMovement.groupInkind.createdAt
                              ? format(
                                  new Date(
                                    selectedMovement.groupInkind.createdAt,
                                  ),
                                  'dd MMM yyyy, HH:mm',
                                )
                              : '—'
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
    </div>
  );
}
