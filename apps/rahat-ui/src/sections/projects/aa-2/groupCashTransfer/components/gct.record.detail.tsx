'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Pencil } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { SpinnerLoader, Back } from 'apps/rahat-ui/src/common';
import { useGetOneGctRecord, useDisburseGroupCashTransfer } from '@rahat-ui/query';
import { useTxUrl } from '../../utils';
import { GCT_STATUS_STYLE } from '../types/gct.types';
import { fmt, DetailRow } from './gct.ui';
import { DisburseButton, DisburseModal } from './gct.disburse-modal';
import { DisbursementInfoCard } from './gct.disbursement-info';

export default function GctRecordDetail() {
  const { id, recordUuid } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const backPath = `/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`;
  const editPath = `/projects/aa/${id}/group-cash-transfer/records/${recordUuid}/edit`;

  const { data, isLoading } = useGetOneGctRecord(projectUUID, recordUuid as string);
  const disburse = useDisburseGroupCashTransfer(projectUUID);
  const getTxUrl = useTxUrl(projectUUID);

  const [disburseOpen, setDisburseOpen] = useState(false);

  const record = data?.data ?? data ?? null;
  const group = record?.groupCashTransfer ?? null;

  if (isLoading || disburse.isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] gap-3">
        <SpinnerLoader />
        {disburse.isPending && (
          <p className="text-sm text-muted-foreground animate-pulse">Processing disbursement…</p>
        )}
      </div>
    );
  }

  const status = record?.status ?? 'NOT_STARTED';
  const canEdit = status === 'NOT_STARTED';

  const handleDisburseClick = async () => {
    await disburse.mutateAsync({ uuid: recordUuid as string });
    setDisburseOpen(true);
  };

  const disabledReason =
    status === 'FAILED' || status === 'REJECTED'
      ? 'Disbursement failed.'
      : status !== 'NOT_STARTED'
      ? 'Already processed.'
      : undefined;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Back path={backPath} />
          <h1 className="text-2xl font-semibold">{record?.title ?? 'Fund Record'}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Group Cash Transfer fund record details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 mt-1"
                    disabled={!canEdit}
                    onClick={() => router.push(editPath)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </span>
              </TooltipTrigger>
              {!canEdit && (
                <TooltipContent>Cannot edit after disbursement has started.</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <DisburseButton
            projectUUID={projectUUID}
            loading={disburse.isPending}
            disabled={!canEdit}
            disabledReason={disabledReason}
            onClick={handleDisburseClick}
          />
        </div>
      </div>

      {/* Record + Group cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-sm">
          <CardContent className="px-4 pt-4 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Record Information
            </p>
            <DetailRow label="Amount" value={record?.amount?.toLocaleString()} />
            <div className="flex flex-col gap-0.5 py-2.5 border-b">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge className={`w-fit text-xs ${GCT_STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'}`}>
                {status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <DetailRow label="Created By" value={record?.createdBy} />
            <DetailRow label="Created At" value={fmt(record?.createdAt)} />
            <DetailRow label="Updated At" value={fmt(record?.updatedAt)} />
            <DetailRow label="Disbursed At" value={fmt(record?.disbursedAt)} />
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="px-4 pt-4 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              GCT Group
            </p>
            <DetailRow label="Group Name" value={group?.name} />
            <DetailRow label="Phone" value={group?.phone} />
            {group?.bankDetails && (
              <>
                <DetailRow label="Bank Name" value={group.bankDetails?.bankName} />
                <DetailRow label="Bank Branch" value={group.bankDetails?.bankBranchName} />
                <DetailRow label="Account Holder Name" value={group.bankDetails?.accountName} />
                <DetailRow label="Account Number" value={group.bankDetails?.accountNumber} mono />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Disbursement info (only present after disburse) */}
      {record?.disbursementInfo && (
        <DisbursementInfoCard
          info={record.disbursementInfo}
          txUrl={getTxUrl(
            record.disbursementInfo?.result?.offrampRequest?.transactionHash ?? record.txHash
          )}
        />
      )}

      <DisburseModal
        projectUUID={projectUUID}
        recordUuid={recordUuid as string}
        record={record}
        group={group}
        open={disburseOpen}
        onOpenChange={setDisburseOpen}
      />
    </div>
  );
}
