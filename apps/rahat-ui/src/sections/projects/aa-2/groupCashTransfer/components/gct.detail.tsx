'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  CheckCircle2,
  Loader2,
  Pencil,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-react';
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
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import SpinnerLoader from 'apps/rahat-ui/src/sections/projects/components/spinner.loader';
import { Back, DemoTable } from 'apps/rahat-ui/src/common';
import { useGetOneGroupCashTransfer, useValidateBankAccount } from '@rahat-ui/query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import GctDeleteDialog from './gct.delete.dialog';
import { DetailRow } from './gct.ui';
import { GctFundRecord, GCT_STATUS_STYLE } from '../types/gct.types';
import { useNumberFormat, useLabelDigits } from '../../../../../utils/useNumberFormat';
import { usePhoneFormat } from '../../../../../utils/usePhoneFormat';

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctDetail() {
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

  // Bank validation messages come from the API, so there is no key to look up
  // directly. Derive one from the message text and use it when a translation
  // exists, otherwise show the server's wording unchanged.
  const localiseValidationMessage = (message: string) => {
    const key = String(message)
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    return t.has(key as never) ? t(key as never) : message;
  };
  const { id, uuid } = useParams();
  const projectUUID = id as UUID;
  const gctUUID = uuid as string;
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { data, isLoading } = useGetOneGroupCashTransfer(projectUUID, gctUUID);
  const validateBank = useValidateBankAccount(projectUUID);

  const item = data?.data ?? data ?? null;
  const extras = item?.extras ?? {};
  const bankDetails = item?.bankDetails ?? {};
  const supportAreas: string[] = Array.isArray(extras?.supportArea)
    ? extras.supportArea
    : [];

  const records: GctFundRecord[] = item?.groupCashTransferRecords ?? [];
  const hasFund = records.length > 0;
  const totalAssigned: number = item?.totalAssignedAmount ?? 0;
  const formatNum = useNumberFormat();
  const formatDigits = useLabelDigits();
  const formatPhone = usePhoneFormat();

  const handleValidateBankAccount = async () => {
    setValidationResult(null);
    try {
      const result = await validateBank.mutateAsync({
        bankName: bankDetails?.bankName,
        bankId: bankDetails?.bankCode,
        bankBranchName: bankDetails?.bankBranchName,
        accountName: bankDetails?.accountName,
        accountNumber: bankDetails?.accountNumber,
        groupUuid: gctUUID,
      });
      const isValid = result?.data?.valid ?? result?.valid ?? false;
      setValidationResult({
        success: isValid,
        message: result?.data?.message || result?.message || (isValid ? t('BANK_ACCOUNT_VALIDATED_SUCCESSFULLY') : t('DISBURSEMENT_FAILED')),
      });
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      setValidationResult({
        success: false,
        message:
          e?.response?.data?.message ||
          e?.message ||
          t('DISBURSEMENT_FAILED'),
      });
    }
  };

  const recordColumns: ColumnDef<GctFundRecord>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: tGlobal('TITLE'),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title || '—'}</span>
        ),
      },
      {
        accessorKey: 'amount',
        header: t('AMOUNT_COL'),
        cell: ({ row }) => (
          <span className="font-semibold">
            {formatNum(row.original.amount)}
          </span>
        ),
      },
      {
        accessorKey: 'createdBy',
        header: t('CREATED_BY_COL'),
        cell: ({ row }) => row.original.createdBy || '—',
      },
      {
        accessorKey: 'status',
        header: t('STATUS_COL'),
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <Badge
              className={`text-xs ${GCT_STATUS_STYLE[s] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {statusLabel(s)}
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
          <Back path={`/projects/aa/${id}/group-cash-transfer?tab=gctGroupList`} />
          <div>
            <h1 className="text-2xl font-semibold">{item?.name ?? '—'}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {t('GCT_GROUP_DETAILS_AND_BANK_INFO')}
            </p>
          </div>
          {hasFund && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 ml-2">
              {t('FUND_RESERVED')}
            </Badge>
          )}
        </div>

        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.Municipality]}
          hasContent={false}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                router.push(
                  `/projects/aa/${id}/group-cash-transfer/${gctUUID}/edit`,
                )
              }
            >
              <Pencil size={14} />
              {tGlobal('EDIT')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
              disabled={hasFund}
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={14} />
              {tGlobal('DELETE')}
            </Button>
          </div>
        </RoleAuth>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Basic info */}
        <Card className="rounded-sm">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t('BASIC_INFORMATION')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <DetailRow label={tGlobal('NAME')} value={item?.name} />
            <Separator />
            <DetailRow label={tGlobal('PHONE')} value={formatPhone(item?.phone)} />
            <Separator />
            <DetailRow label={tGlobal('EMAIL')} value={extras?.email} />
            <Separator />
            <DetailRow label={t('DISTRICT')} value={extras?.district} />
            <Separator />
            <DetailRow label={tGlobal('MUNICIPALITY')} value={extras?.municipality} />
            <Separator />
            <DetailRow label={tGlobal('WARD_COMMUNITY')} value={formatDigits(extras?.ward)} />
            <Separator />
            <div className="flex flex-col gap-1 py-2">
              <span className="text-xs text-muted-foreground">{tGlobal('SUPPORT_AREA')}</span>
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {t('BANK_DETAILS')}
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        size="sm"
                        className="gap-1.5 rounded-sm"
                        onClick={handleValidateBankAccount}
                        disabled={validateBank.isPending || !bankDetails?.accountNumber || !!extras?.isBankValidated}
                      >
                        {validateBank.isPending ? (
                          <><Loader2 size={12} className="animate-spin" />{t('VALIDATING')}</>
                        ) : extras?.isBankValidated ? (
                          <>{t('BANK_VALIDATED')}</>
                        ) : (
                          t('VALIDATE_BANK_DETAILS')
                        )}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {extras?.isBankValidated && (
                    <TooltipContent>{t('BANK_ACCOUNT_ALREADY_VALIDATED')}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {validationResult && (
              <div
                className={`flex items-center gap-2 text-xs mb-3 p-2 rounded ${
                  validationResult.success
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {localiseValidationMessage(validationResult.message)}
              </div>
            )}
            <DetailRow label={t('BANK_NAME')} value={bankDetails?.bankName} />
            <Separator />
            <DetailRow label={t('BANK_BRANCH_NAME')} value={bankDetails?.bankBranchName} />
            <Separator />
            <DetailRow label={t('ACCOUNT_HOLDER_NAME')} value={bankDetails?.accountName} />
            <Separator />
            <DetailRow label={t('ACCOUNT_NUMBER')} value={formatDigits(bankDetails?.accountNumber)} />
            <Separator />
            <DetailRow
              label={t('TOTAL_RESERVED_AMOUNT')}
              value={formatNum(totalAssigned)}
            />
          </CardContent>
        </Card>
      </div>

      {records.length > 0 && (
        <Card className="rounded-sm mt-4">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t('RESERVED_FUND_RECORDS')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <DemoTable table={recordTable} tableHeight="h-auto" />
          </CardContent>
        </Card>
      )}

      <GctDeleteDialog
        projectUUID={projectUUID}
        item={item}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() =>
          router.push(`/projects/aa/${id}/group-cash-transfer`)
        }
      />
    </div>
  );
}
