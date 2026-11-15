'use client';
import React, { useState, useMemo } from 'react';

import { Coins, User } from 'lucide-react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useProjectBeneficiaryGroupDetailsTableColumns } from './columns';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import {
  useExportBeneficiariesExcel,
  useGenerateQrPdf,
  useGetBeneficiariesQr,
  useGetSponsorshipStatusForGroup,
  useRegenerateQrPdf,
  useRetrySponsorshipForGroup,
  useSingleBeneficiaryGroup,
} from '@rahat-ui/query';
import {
  ClientSidePagination,
  DataCard,
  DemoTable,
  HeaderWithBack,
  SearchInput,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { ChevronDown, CloudDownload, Loader2, RefreshCw } from 'lucide-react';
import { QrOtpConfirmValues, QrOtpDialog } from './qr-otp.dialog';
import { exportToExcel } from 'apps/rahat-ui/src/utils/exportToExcle';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { isQrPdfInProgress } from 'libs/query/src/lib/aa/beneficiaries/qr-pdf-status';
import { downloadQrPdf } from './qr-pdf-download';
import { toast } from 'react-toastify';

const BeneficiaryGroupsDetails = () => {
  const tGlobal = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.groupId as UUID;
  const t = useTranslations('AA_PROJECT');
  const { data: groupDetails, isPending: isGroupLoading } =
    useSingleBeneficiaryGroup(projectId, groupId);

  const {
    data: qrDetails,
    isPending: isQrLoading,
    isError: isQrError,
    refetch: refetchQr,
  } = useGetBeneficiariesQr({ projectUuid: projectId, groupId });

  const { mutate: generateQr, isPending: isGeneratingQr } =
    useGenerateQrPdf(projectId);
  const { mutate: regenerateQr, isPending: isRegeneratingQr } =
    useRegenerateQrPdf(projectId);
  const [isQrOptionsOpen, setIsQrOptionsOpen] = useState(false);
  const [isExcelOptionsOpen, setIsExcelOptionsOpen] = useState(false);
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);
  // Tracks which action the dialog's confirm button should trigger --
  // the initial generate, or a re-generate of an already-completed QR.
  const [qrDialogMode, setQrDialogMode] = useState<'generate' | 'regenerate'>(
    'generate',
  );
  const { mutate: exportExcel, isPending: isExporting } =
    useExportBeneficiariesExcel(projectId);

  const isSubmittingQr = isGeneratingQr || isRegeneratingQr;
  const isQrProcessing = isSubmittingQr || isQrPdfInProgress(qrDetails?.status);

  const handleDownloadQr = async () => {
    if (!qrDetails?.fileUrl || isDownloadingQr) return;
    setIsDownloadingQr(true);
    try {
      const { data: latestQr, isError } = await refetchQr();
      if (isError || latestQr?.status !== 'completed' || !latestQr.fileUrl) {
        throw new Error('QR PDF is not available');
      }
      await downloadQrPdf(latestQr.fileUrl, `beneficiaries-${groupId}-qr.pdf`);
    } catch {
      toast.error(t('FAILED_TO_DOWNLOAD_QR_PDF'));
    } finally {
      setIsDownloadingQr(false);
    }
  };

  const handleGenerateQr = ({
    includeOtp,
    onlyUnphonedBeneficiaries,
    pdfFields,
  }: QrOtpConfirmValues) => {
    if (isQrProcessing) return;
    const mutate = qrDialogMode === 'regenerate' ? regenerateQr : generateQr;
    mutate(
      { groupId, includeOtp, onlyUnphonedBeneficiaries, pdfFields },
      {
        onSuccess: () => setIsQrOptionsOpen(false),
      },
    );
  };

  const openQrDialog = (mode: 'generate' | 'regenerate') => {
    setQrDialogMode(mode);
    setIsQrOptionsOpen(true);
  };

  const handleExportExcel = ({
    includeOtp,
    onlyUnphonedBeneficiaries,
    pdfFields,
  }: QrOtpConfirmValues) => {
    if (isExporting) return;

    exportExcel(
      {
        groupId,
        includeOtp,
        onlyUnphonedBeneficiaries,
        excelFields: pdfFields,
      },
      {
        onSuccess: (rows) => {
          const list = Array.isArray(rows) ? rows : [];
          exportToExcel(list, `beneficiaries-${groupDetails?.name ?? groupId}`);
          setIsExcelOptionsOpen(false);
        },
      },
    );
  };

  const { data: sponsorshipStatus } = useGetSponsorshipStatusForGroup({
    projectUuid: projectId,
    groupUuid: groupId,
  });
  const { mutate: retrySponsorship, isPending: isRetrying } =
    useRetrySponsorshipForGroup(projectId);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useProjectBeneficiaryGroupDetailsTableColumns();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const tableData = useMemo(() => {
    if (groupDetails) {
      return groupDetails?.groupedBeneficiaries?.map((d: any) => ({
        walletAddress: d?.Beneficiary?.walletAddress,
        name: d?.Beneficiary?.pii?.name,
        benefId: d?.beneficiaryId,
      }));
    } else return [];
  }, [groupDetails]);
  const table = useReactTable({
    // manualPagination: true,
    data: tableData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      columnFilters,
    },
  });

  const totalTokensAssigned = React.useMemo(() => {
    if (groupDetails?.benfGroupTokensStatus === 'NOT_DISBURSED') return 0;
    return (
      groupDetails?.groupedBeneficiaries?.reduce(
        (sum, item) => sum + (item.tokensReserved ?? 0),
        0,
      ) || 0
    );
  }, [groupDetails]);

  if (isGroupLoading || isQrLoading) {
    return <SpinnerLoader />;
  }

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center ">
        <HeaderWithBack
          title={groupDetails?.name}
          subtitle={t('DETAILED_VIEW_OF_THE_SELECTED_BENEFICIARY2')}
          path={`/projects/aa/${projectId}/beneficiary?tab=beneficiaryGroups`}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExcelOptionsOpen(true)}
            className="cursor-pointer"
            disabled={isExporting}
          >
            <CloudDownload className="mr-1" />
            {t('DOWNLOAD_EXCEL')}
          </Button>
          {isQrError ? (
            <Button variant="outline" onClick={() => refetchQr()}>
              {tGlobal('RETRY')}
            </Button>
          ) : isQrProcessing ? (
            <Button variant="outline" disabled aria-live="polite">
              <Loader2 className="mr-1 animate-spin" />
              {t('GENERATING')}
            </Button>
          ) : qrDetails?.status === 'completed' && qrDetails.fileUrl ? (
            <div className="flex">
              <Button
                variant="outline"
                onClick={handleDownloadQr}
                className="cursor-pointer rounded-r-none border-r-0"
                disabled={isDownloadingQr}
              >
                {isDownloadingQr ? (
                  <Loader2 className="mr-1 animate-spin" />
                ) : (
                  <CloudDownload className="mr-1" />
                )}
                {isDownloadingQr ? t('DOWNLOADING_QR') : t('DOWNLOAD_QR')}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer rounded-l-none px-2"
                    disabled={isDownloadingQr}
                  >
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a
                      href={qrDetails.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CloudDownload className="mr-2 h-4 w-4" />
                      {t('OPEN_QR_PDF')}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => openQrDialog('regenerate')}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('REGENERATE_QR')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() =>
                openQrDialog(
                  qrDetails?.status === 'completed' ? 'regenerate' : 'generate',
                )
              }
              className="cursor-pointer"
              disabled={isQrLoading || isQrProcessing}
            >
              <CloudDownload className="mr-1" />
              {qrDetails?.status === 'completed'
                ? t('REGENERATE_QR')
                : t('GENERATE_QR')}
            </Button>
          )}
          {sponsorshipStatus?.isStellarChain && (
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={isRetrying}
              onClick={() => retrySponsorship(groupId)}
            >
              {t('RETRY_SPONSORSHIP')}
            </Button>
          )}
        </div>
        {isQrError && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {t('FAILED_TO_LOAD_QR_STATUS')}
          </p>
        )}
        {qrDetails?.status === 'failed' && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {t('FAILED_TO_GENERATE_QR_PDF')}
            {qrDetails.error ? `: ${qrDetails.error}` : ''}
          </p>
        )}
        {!isQrError && qrDetails?.status === 'completed' && !qrDetails?.fileUrl && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {t('QR_PDF_UNAVAILABLE')}
          </p>
        )}
      </div>
      {sponsorshipStatus?.isStellarChain ? (
        <div className="flex items-center gap-4 mb-3 text-sm">
          <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground">
            {t('SPONSORED_OF_TOTAL', {
              sponsored: formatNum(sponsorshipStatus.sponsored),
              total: formatNum(sponsorshipStatus.total),
            })}
          </span>
          {sponsorshipStatus.pending === 0 && (
            <>
              <span className="text-green-600">
                {t('SUCCESS_COUNT', {
                  count: formatNum(sponsorshipStatus.sponsored),
                })}
              </span>
              <span className="text-red-600">
                {t('FAILED_COUNT', {
                  count: formatNum(sponsorshipStatus.failed),
                })}
              </span>
            </>
          )}
        </div>
      ) : null}
      <div className="flex gap-6 mb-5">
        <DataCard
          className="border-solid w-1/4 rounded-xl"
          iconStyle="bg-white text-secondary-muted"
          title={t('TOTAL_BENEFICIARIES')}
          Icon={User}
          number={formatNum(groupDetails?.groupedBeneficiaries?.length ?? 0)}
        />
        {/* <DataCard
          className="border-solid w-1/4 rounded-xl"
          iconStyle="bg-white text-secondary-muted"
          title={t('TOTAL_TOKEN_ASSIGNED')}
          Icon={Coins}
          number={formatNum(totalTokensAssigned)}
        /> */}
      </div>
      <div className="p-4 rounded-sm border">
        <SearchInput
          className="w-full m-1"
          name={tGlobal('WALLET_ADDRESS')}
          value={
            (table.getColumn('walletAddress')?.getFilterValue() as string) ?? ''
          }
          onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('walletAddress')?.setFilterValue(event.target.value)
          }
        />
        <DemoTable table={table} tableHeight="h-[calc(100vh-500px)]" />

        <ClientSidePagination table={table} />
      </div>
      <QrOtpDialog
        open={isQrOptionsOpen}
        onOpenChange={setIsQrOptionsOpen}
        onConfirm={handleGenerateQr}
        isPending={isSubmittingQr}
      />
      <QrOtpDialog
        open={isExcelOptionsOpen}
        onOpenChange={setIsExcelOptionsOpen}
        onConfirm={handleExportExcel}
        isPending={isExporting}
        title={t('DOWNLOAD_EXCEL')}
        description={t('EXCEL_EXPORT_OPTIONS_DESCRIPTION')}
        confirmLabel={t('DOWNLOAD')}
        pendingLabel={t('GENERATING')}
      />
    </div>
  );
};

export default BeneficiaryGroupsDetails;
