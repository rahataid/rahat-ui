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
import {
  useInkindsSummary,
  useInkindTransactions,
  useBeneficiaryGroups,
} from '@rahat-ui/query';
import { INKIND_TYPE_LABELS } from '../schemas/inkind.validation';
import { formatLabel } from './inkind.allocation.list';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';

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
    group: {
      name: string;
    }
    groupId: string;
    inkindId: string;
    quantityAllocated: number;
    quantityRedeemed: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  redemption: unknown | null;
};

const MOVEMENT_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string; Icon: React.ElementType }
> = {
  ADD: {
    label: 'Inkind Added',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    Icon: ArrowUp,
  },
  REMOVE: {
    label: 'Inkind Removed',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    Icon: ArrowDown,
  },
  LOCK: {
    label: 'Assigned to group',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    Icon: Archive,
  },
  UNLOCK: {
    label: 'Inkind Unlocked',
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
  const perPage = 10;

  const { data: summaryData } = useInkindsSummary(projectUUID);
  const { data: txData, isFetching: txFetching } = useInkindTransactions(projectUUID, { page, perPage });

  const inkindItemsSummary: any[] = summaryData?.data ?? [];
  const movements: Movement[] = txData?.data ?? [];
  const meta = txData?.response?.meta;
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="flex flex-col h-full">
      <Heading
        title="Inkind Overview"
        titleStyle="text-lg"
        description="Overview of all in-kind items and stock movements"
      />

      <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 mb-3">
        <DataCard
          className="rounded-sm"
          title="Total Inkind Types"
          number={String(inkindItemsSummary?.totalInkindTypes ? inkindItemsSummary.totalInkindTypes : 0)}
          subtitle="Distinct items registered"
        />
        <DataCard
          className="rounded-sm"
          title="Available Stock"
          number={String(inkindItemsSummary?.totalAvailableStock ? inkindItemsSummary.totalAvailableStock : 0)}
          subtitle="Units currently available"
        />
        <DataCard
          className="rounded-sm"
          title="Assigned Stock"
          number={String(inkindItemsSummary?.totalAssignedStock ? inkindItemsSummary.totalAssignedStock : 0)}
          subtitle="Units currently assigned"
        />
        <DataCard
          className="rounded-sm"
          title="Redeemed Stock"
          number={String(inkindItemsSummary?.totalRedeemedStock ? inkindItemsSummary.totalRedeemedStock : 0)}
          subtitle="Units currently redeemed"
        />
      </div>

      <div className="flex flex-col flex-[2] border rounded-sm p-4 min-h-0">
        <div className="flex items-start justify-between mb-0.5">
          <h1 className="text-sm font-semibold">Overall Inkind Flow</h1>
          {meta && meta.lastPage > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={!meta.prev}
                className="h-7 w-7 flex items-center justify-center rounded border text-xs disabled:opacity-40 hover:bg-muted transition-colors"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!meta.prev}
                className="h-7 w-7 flex items-center justify-center rounded border text-xs disabled:opacity-40 hover:bg-muted transition-colors"
              >
                ‹
              </button>
              {(() => {
                const total = meta.lastPage;
                const current = meta.currentPage;
                const delta = 1;
                const pages: (number | '...')[] = [];
                for (let i = 1; i <= total; i++) {
                  if (
                    i === 1 ||
                    i === total ||
                    (i >= current - delta && i <= current + delta)
                  ) {
                    pages.push(i);
                  } else if (
                    pages[pages.length - 1] !== '...'
                  ) {
                    pages.push('...');
                  }
                }
                return pages.map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="h-7 w-7 flex items-center justify-center text-xs text-muted-foreground">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-7 w-7 flex items-center justify-center rounded border text-xs transition-colors ${p === current
                          ? 'bg-primary text-primary-foreground border-primary text-[#FFF]'
                          : 'hover:bg-muted'
                        }`}
                    >
                      {p}
                    </button>
                  ),
                );
              })()}
              <button
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={!meta.next}
                className="h-7 w-7 flex items-center justify-center rounded border text-xs disabled:opacity-40 hover:bg-muted transition-colors"
              >
                ›
              </button>
              <button
                onClick={() => setPage(meta.lastPage)}
                disabled={!meta.next}
                className="h-7 w-7 flex items-center justify-center rounded border text-xs disabled:opacity-40 hover:bg-muted transition-colors"
              >
                »
              </button>
            </div>
          )}
        </div>
        {movements.length !== 0 && (
          <p className="text-xs text-muted-foreground mb-3">
            Click on any logs to view details
          </p>
        )}
        <div className="relative flex-1 min-h-[200px]">
          {txFetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-sm">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          )}
          <ScrollArea className="flex-1 min-h-[200px] max-h-[50vh] overflow-auto items-center justify-center">
            {movements.length === 0 ? (
              <p className="text-sm text-muted-foreground align-center justify-center text-center py-6">
                No records available.
              </p>
            ) : (
              <div className="flex flex-col space-y-2">
                {sortedMovements.map((movement) => {
                  const config =
                    MOVEMENT_CONFIG[movement.type] ?? MOVEMENT_CONFIG['ADD'];
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
                            <TruncatedCell text={movement.inkind?.name || '—'} maxLength={30} />
                            <Badge className="bg-gray-200 text-gray-600">
                              {formatLabel(INKIND_TYPE_LABELS[movement.inkind?.type])}
                            </Badge>
                          </div>
                          {movement.groupInkind && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {movement.groupInkind?.group?.name || '-'}
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
                        <span className={`text-sm font-semibold ${config.color}`}>
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

                  <div className="mb-5">
                    <SectionTitle title="Transaction" />
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

                  {selectedMovement.inkind && (
                    <div className="mb-5">
                      <SectionTitle title="Inkind Item" />
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
                            <Badge className="bg-gray-200 text-gray-600">
                              {formatLabel(INKIND_TYPE_LABELS[selectedMovement.inkind.type])}
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

                  {selectedMovement.groupInkind && (
                    <div className="mb-5">
                      <SectionTitle title="Group Allocation" />
                      <div className="border rounded-md px-3">
                        <DetailRow
                          icon={Users}
                          label="Group"
                          value={
                            <span className="text-primary font-bold">
                              {selectedMovement.groupInkind.group?.name ?? '—'}
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
    </div>
  );
}
