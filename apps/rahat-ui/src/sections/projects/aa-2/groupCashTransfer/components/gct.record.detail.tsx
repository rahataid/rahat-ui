'use client';

import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { format } from 'date-fns';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DataCard,
  HeaderWithBack,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { useGetOneGctRecord } from '@rahat-ui/query';
import {
  Banknote,
  CalendarClock,
  CircleUser,
  Hash,
  Info,
  Tag,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-yellow-100 text-yellow-700',
  STARTED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(date?: string | null) {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM dd, yyyy  hh:mm a');
  } catch {
    return date;
  }
}

// ─── Info detail row inside a card ────────────────────────────────────────────

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-mono break-all' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctRecordDetail() {
  const { id, recordUuid } = useParams();
  const projectUUID = id as UUID;

  const { data, isLoading } = useGetOneGctRecord(
    projectUUID,
    recordUuid as string,
  );

  const record = data?.data ?? data ?? null;
  const group = record?.groupCashTransfer ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <SpinnerLoader />
      </div>
    );
  }

  const status = record?.status ?? 'NOT_STARTED';

  const statCards = [
    { title: 'Amount', number: record?.amount?.toLocaleString() ?? '0' },
    { title: 'Status', number: status.replace(/_/g, ' ') },
    { title: 'Created By', number: record?.createdBy ?? '—' },
    {
      title: 'Disbursed At',
      number: record?.disbursedAt ? fmt(record.disbursedAt) : 'Not disbursed',
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <HeaderWithBack
          title={record?.title ?? 'Fund Record'}
          subtitle="Group Cash Transfer fund record details"
          path={`/projects/aa/${id}/group-cash-transfer/${group?.uuid ?? ''}`}
        />
        <Badge
          className={`text-xs mt-1 ${STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {status.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DataCard
          title="Amount"
          number={record?.amount?.toLocaleString() ?? '0'}
          Icon={Banknote}
          className="border rounded-sm"
        />
        <DataCard
          title="Status"
          number={status.replace(/_/g, ' ')}
          Icon={Info}
          className="border rounded-sm"
        />
        <DataCard
          title="Created By"
          number={record?.createdBy ?? '—'}
          Icon={CircleUser}
          className="border rounded-sm"
        />
        <DataCard
          title="Disbursed At"
          number={record?.disbursedAt ? fmt(record.disbursedAt) : 'Not disbursed'}
          Icon={CalendarClock}
          className="border rounded-sm"
        />
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Record details */}
        <Card className="rounded-sm">
          <CardContent className="px-4 pt-4 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Record Information
            </p>
            <DetailRow label="Title" value={record?.title} />
            <DetailRow label="Record UUID" value={record?.uuid} mono />
            <DetailRow
              label="Amount"
              value={record?.amount?.toLocaleString()}
            />
            <DetailRow label="Status" value={status.replace(/_/g, ' ')} />
            <DetailRow label="Created By" value={record?.createdBy} />
            <DetailRow
              label="Payout Processor ID"
              value={record?.payoutProcessorId}
              mono
            />
            <DetailRow label="Created At" value={fmt(record?.createdAt)} />
            <DetailRow label="Updated At" value={fmt(record?.updatedAt)} />
            <DetailRow label="Disbursed At" value={fmt(record?.disbursedAt)} />
          </CardContent>
        </Card>

        {/* GCT Group details */}
        <Card className="rounded-sm">
          <CardContent className="px-4 pt-4 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              GCT Group
            </p>
            <DetailRow label="Group Name" value={group?.name} />
            <DetailRow label="Group UUID" value={group?.uuid} mono />
            <DetailRow label="Phone" value={group?.phone} />
            {group?.bankDetails && (
              <>
                <DetailRow
                  label="Bank Name"
                  value={group.bankDetails?.bankName}
                />
                <DetailRow
                  label="Bank Branch"
                  value={group.bankDetails?.bankBranchName}
                />
                <DetailRow
                  label="Account Holder"
                  value={group.bankDetails?.accountName}
                />
                <DetailRow
                  label="Account Number"
                  value={group.bankDetails?.accountNumber}
                  mono
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
