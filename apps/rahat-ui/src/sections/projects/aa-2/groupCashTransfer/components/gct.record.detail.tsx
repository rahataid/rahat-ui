'use client';

import { useTranslations } from 'next-intl';
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
import {
  useGetOneGctRecord,
  useProjectSettingsStore,
  PROJECT_SETTINGS_KEYS,
} from '@rahat-ui/query';
import { GCT_STATUS_STYLE } from '../types/gct.types';
import { fmt, DetailRow } from './gct.ui';
import { DisburseButton, DisburseModal } from './gct.disburse-modal';
import { DisbursementInfoCard } from './gct.disbursement-info';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { useNumberFormat } from '../../../../../utils/useNumberFormat';
import { usePhoneFormat } from '../../../../../utils/usePhoneFormat';

export default function GctRecordDetail() {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tGlobal = useTranslations('GLOBAL');
  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      NOT_STARTED: t('NOT_STARTED'),
      PENDING: tGlobal('PENDING'),
      STARTED: t('STARTED'),
      COMPLETED: tGlobal('COMPLETED'),
      SUCCESS: tGlobal('SUCCESS'),
      FAILED: tGlobal('FAILED'),
      REJECTED: t('REJECTED'),
    };
    return map[s] ?? s.replace(/_/g, ' ');
  };
  const { id, recordUuid } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const backPath = `/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`;
  const editPath = `/projects/aa/${id}/group-cash-transfer/records/${recordUuid}/edit`;

  const { data, isLoading } = useGetOneGctRecord(
    projectUUID,
    recordUuid as string,
  );
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));

  const [disburseOpen, setDisburseOpen] = useState(false);
  const formatNum = useNumberFormat();
  const formatPhone = usePhoneFormat();

  const record = data?.data ?? data ?? null;
  const group = record?.groupCashTransfer ?? null;

  const status = record?.status ?? 'NOT_STARTED';
  const canEdit = status === 'NOT_STARTED';
  const canDisburse =
    status === 'NOT_STARTED' || status === 'TOKEN_TRANSFERRED';

  // disburse now fires from the modal, after OTP verification
  const handleDisburseClick = () => setDisburseOpen(true);

  const disabledReason =
    status === 'FAILED' || status === 'REJECTED'
      ? t('DISBURSEMENT_FAILED')
      : !canDisburse
      ? t('ALREADY_PROCESSED')
      : undefined;

  const getTxUrl = getExplorerUrl({
    chainSettings:
      settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
    target: 'tx',
    value:
      record?.disbursementInfo?.result?.offrampRequest?.transactionHash ??
      record?.txHash,
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
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Back path={backPath} />
          <h1 className="text-2xl font-semibold">
            {record?.title ?? t('FUND_RECORD')}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {t('GROUP_CASH_TRANSFER_FUND_RECORD_DETAILS')}
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
                    {tGlobal('EDIT')}
                  </Button>
                </span>
              </TooltipTrigger>
              {!canEdit && (
                <TooltipContent>
                  {t('CANNOT_EDIT_AFTER_DISBURSEMENT')}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <DisburseButton
            projectUUID={projectUUID}
            disabled={!canDisburse}
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
              {t('RECORD_INFORMATION')}
            </p>
            <DetailRow
              label={t('AMOUNT_COL')}
              value={formatNum(record?.amount ?? 0)}
            />
            <div className="flex flex-col gap-0.5 py-2.5 border-b">
              <span className="text-xs text-muted-foreground">{t('STATUS_COL')}</span>
              <Badge
                className={`w-fit text-xs ${
                  GCT_STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'
                }`}
              >
                {statusLabel(status)}
              </Badge>
            </div>
            <DetailRow label={t('CREATED_BY_COL')} value={record?.createdBy} />
            <DetailRow label={tGlobal('CREATED_AT')} value={fmt(record?.createdAt)} />
            <DetailRow label={t('UPDATED_AT')} value={fmt(record?.updatedAt)} />
            <DetailRow label={t('DISBURSED_AT')} value={fmt(record?.disbursedAt)} />
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="px-4 pt-4 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {t('GCT_GROUP')}
            </p>
            <DetailRow label={t('GROUP_NAME_COL')} value={group?.name} />
            <DetailRow label={t('PHONE_COL')} value={formatPhone(group?.phone)} />
            {group?.bankDetails && (
              <>
                <DetailRow
                  label={t('BANK_NAME')}
                  value={group.bankDetails?.bankName}
                />
                <DetailRow
                  label={t('BANK_BRANCH')}
                  value={group.bankDetails?.bankBranchName}
                />
                <DetailRow
                  label={t('ACCOUNT_HOLDER_NAME')}
                  value={group.bankDetails?.accountName}
                />
                <DetailRow
                  label={t('ACCOUNT_NUMBER')}
                  value={group.bankDetails?.accountNumber}
                  mono
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Disbursement info (only present after disburse) */}
      {record?.disbursementInfo && (
        <DisbursementInfoCard info={record.disbursementInfo} txUrl={getTxUrl} />
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
