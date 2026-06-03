'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Pencil, Trash2 } from 'lucide-react';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import SpinnerLoader from 'apps/rahat-ui/src/sections/projects/components/spinner.loader';
import Back from 'apps/rahat-ui/src/sections/projects/components/back';
import { useGetOneGroupCashTransfer } from '@rahat-ui/query';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DemoTable } from 'apps/rahat-ui/src/common';
import GctDeleteDialog from './gct.delete.dialog';
import GctUpdateSheet from './gct.update.sheet';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || '—'}</span>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-yellow-100 text-yellow-700',
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-600',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctDetail() {
  const { id, uuid } = useParams();
  const projectUUID = id as UUID;
  const gctUUID = uuid as string;
  const router = useRouter();

  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading } = useGetOneGroupCashTransfer(projectUUID, gctUUID);
  const item = data?.data ?? data ?? null;

  const extras = item?.extras ?? {};
  const bankDetails = item?.bankDetails ?? {};
  const supportAreas: string[] = Array.isArray(extras?.supportArea)
    ? extras.supportArea
    : [];

  type FundRecord = { uuid: string; title?: string; amount: number; status: string; createdBy?: string };
  const records: FundRecord[] = item?.groupCashTransferRecords ?? [];
  const hasFund = records.length > 0;
  const totalAssigned: number = item?.totalAssignedAmount ?? 0;

  // Fund records table — hooks must be unconditional, before any early return
  const recordColumns: ColumnDef<FundRecord>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title || '—'}</span>
        ),
      },
      {
        accessorKey: 'uuid',
        header: 'Record UUID',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground truncate block max-w-[220px]">
            {row.original.uuid}
          </span>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.amount.toLocaleString()}</span>
        ),
      },
      {
        accessorKey: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => row.original.createdBy || '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <Badge className={`text-xs ${STATUS_STYLE[s] ?? 'bg-gray-100 text-gray-600'}`}>
              {s.replace('_', ' ')}
            </Badge>
          );
        },
      },
    ],
    [],
  );

  const recordTable = useReactTable({
    data: records,
    columns: recordColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Back path={`/projects/aa/${id}/group-cash-transfer`} />
          <div>
            <h1 className="text-2xl font-semibold">{item?.name ?? '—'}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              GCT Group details and bank information
            </p>
          </div>
          {hasFund && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 ml-2">
              Fund Assigned
            </Badge>
          )}
        </div>

        <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]} hasContent={false}>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setUpdateOpen(true)}
            >
              <Pencil size={14} />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
              disabled={hasFund}
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </RoleAuth>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Basic info */}
        <Card className="rounded-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <InfoRow label="Name" value={item?.name} />
            <Separator />
            <InfoRow label="Phone" value={item?.phone} />
            <Separator />
            <InfoRow label="Email" value={extras?.email} />
            <Separator />
            <InfoRow label="District" value={extras?.district} />
            <Separator />
            <InfoRow label="Municipality" value={extras?.municipality} />
            <Separator />
            <InfoRow label="Ward (Community)" value={extras?.ward} />
            <Separator />
            {/* Support area pills */}
            <div className="flex flex-col gap-1 py-2">
              <span className="text-xs text-muted-foreground">Support Area</span>
              {supportAreas.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {supportAreas.map((area) => (
                    <Badge
                      key={area}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm font-medium">—</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank details */}
        <Card className="rounded-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <InfoRow label="Bank Name" value={bankDetails?.bankName} />
            <Separator />
            <InfoRow label="Bank Branch Name" value={bankDetails?.bankBranchName} />
            <Separator />
            <InfoRow label="Account Holder Name" value={bankDetails?.accountName} />
            <Separator />
            <InfoRow label="Account Number" value={bankDetails?.accountNumber} />
            <Separator />
            <InfoRow label="Total Assigned Amount" value={totalAssigned.toLocaleString()} />
          </CardContent>
        </Card>
      </div>

      {/* Fund records table */}
      {records.length > 0 && (
        <Card className="rounded-sm mt-4">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Assigned Fund Records
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <DemoTable table={recordTable} tableHeight="h-auto" />
          </CardContent>
        </Card>
      )}

      {/* Update sheet */}
      <GctUpdateSheet
        projectUUID={projectUUID}
        item={item}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
      />

      {/* Delete dialog */}
      <GctDeleteDialog
        projectUUID={projectUUID}
        item={item}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.push(`/projects/aa/${id}/group-cash-transfer`)}
      />
    </div>
  );
}
