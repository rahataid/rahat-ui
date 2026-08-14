import * as React from 'react';
import {
  CloudDownloadIcon,
  LandmarkIcon,
  Loader2,
  Trash2Icon,
  UsersRound,
  Phone,
  FolderDot,
  Pencil,
} from 'lucide-react';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import MembersTable from './members.table';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  useExportBeneficiariesFailedBankAccount,
  useGetBankCheckStatus,
  useGetBeneficiaryGroup,
  usePagination,
  useSyncBeneficiaryGroup,
} from '@rahat-ui/query';
import { useBeneficiaryTableColumns } from '../useBeneficiaryColumns';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

const RemoveBenfGroupModal = React.lazy(() => import('./removeGroupModal'));
const ValidateBenefBankAccountByGroupUuid = React.lazy(
  () => import('./validateAccountModal'),
);
const UpdateGroupProposeModal = React.lazy(() => import('./groupProposeModal'));
const AssignBeneficiaryToProjectModal = React.lazy(
  () => import('./assignToProjectModal'),
);
const GroupNameEditModal = React.lazy(() => import('./groupNameEditModal'));

import * as XLSX from 'xlsx';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { GroupPurpose } from 'apps/rahat-ui/src/constants/beneficiary.const';
import LoaderRahat from 'apps/rahat-ui/src/components/LoaderRahat';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

type BenProjectType = {
  Project: {
    id: number;
    name: string;
    type: string;
  };
};

export default function GroupDetailView() {
  const { Id } = useParams() as { Id: UUID };
  const t = useTranslations('GLOBAL');
  const formatDigits = useLabelDigits();
  const validateModal = useBoolean();
  const removeModal = useBoolean();
  const groupProposeModal = useBoolean();
  const projectModal = useBoolean();
  const editGroupNameModal = useBoolean(false);

  const handleAssignModalClick = () => {
    validateModal.onTrue();
  };

  const handleRemoveClick = () => {
    removeModal.onTrue();
  };

  const handleGroupPurposeClick = () => {
    groupProposeModal.onTrue();
  };

  const handleProjectAssignModalClick = () => {
    projectModal.onTrue();
  };

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();
  const columns = useBeneficiaryTableColumns();
  const { data } = useExportBeneficiariesFailedBankAccount(Id);

  const [clickedValidateBankAccount, setClickedValidateBankAccount] = useState(
    () => {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem(`bank_validation_${Id}`) === 'true';
      }
      return false;
    },
  );

  const groupedBeneficiaries = [] as any;
  const debouncedFilters = useDebounce(filters, 500);

  const { data: group, isLoading } = useGetBeneficiaryGroup(Id, {
    ...pagination,
    ...debouncedFilters,
  });

  const isBankTransfer =
    group?.data?.groupPurpose === GroupPurpose.BANK_TRANSFER;
  const { data: bankCheckStatus } = useGetBankCheckStatus(
    Id,
    isBankTransfer,
    clickedValidateBankAccount,
  );
  const syncBeneficiaryGroup = useSyncBeneficiaryGroup();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const tableData = React.useMemo(() => {
    if (group) {
      const groupPurpose = group?.data?.groupPurpose;
      return group?.data?.groupedBeneficiaries?.map((d: any) => ({
        name: d?.Beneficiary?.pii?.name,
        phone: d?.Beneficiary?.pii?.phone,
        email: d?.Beneficiary?.pii?.email,
        location: d?.Beneficiary?.location,
        gender: d?.Beneficiary?.gender,
        walletAddress: d?.Beneficiary?.walletAddress,
        internetStatus: d?.Beneficiary?.internetStatus,
        phoneStatus: d?.Beneficiary?.phoneStatus,
        bankedStatus: d?.Beneficiary?.bankedStatus,
        uuid: d?.Beneficiary?.uuid,
        error: d?.Beneficiary?.extras?.error,
        extras: d?.Beneficiary?.extras,
        groupPurpose: groupPurpose,
        isGroupValidForAA: group?.data?.isGroupValidForAA,
      }));
    } else return [];
  }, [group]);

  const table = useReactTable({
    manualPagination: true,
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const groupPurposeName = React.useMemo(() => {
    return group?.data?.groupPurpose
      ? group?.data?.groupPurpose.split('_')[0]
      : '';
  }, [group?.data?.groupPurpose]);

  const groupPurposeLabel = React.useMemo(() => {
    switch (group?.data?.groupPurpose) {
      case GroupPurpose.BANK_TRANSFER:
        return t('BANK_TRANSFER');
      case GroupPurpose.MOBILE_MONEY:
        return t('MOBILE_MONEY');
      case GroupPurpose.COMMUNICATION:
        return t('COMMUNICATION');
      case GroupPurpose.GENERAL:
        return t('GENERAL');
      default:
        return capitalizeFirstLetter(groupPurposeName || '');
    }
  }, [group?.data?.groupPurpose, groupPurposeName, t]);

  const isAssignToAA = React.useMemo(() => {
    return group?.data?.beneficiaryGroupProject?.some(
      (benProject: BenProjectType) =>
        benProject?.Project?.type?.toLowerCase() === 'aa',
    );
  }, [group?.data?.beneficiaryGroupProject]);

  const assignedGroupId = React.useMemo(() => {
    return (
      group?.data?.beneficiaryGroupProject?.map(
        (benProject: BenProjectType) => benProject.Project.id,
      ) ?? []
    );
  }, [group?.data?.beneficiaryGroupProject]);

  const onFailedExports = () => {
    const rowsToDownload = data?.data || [];
    const workbook = XLSX.utils.book_new();
    const worksheetData = rowsToDownload?.map((benef: any) => ({
      Name: benef?.Beneficiary?.pii.name,
      Phone: benef?.Beneficiary?.pii.phone,
      Wallet_Address: benef?.Beneficiary?.walletAddress,
      Reason: benef?.Beneficiary?.extras?.error,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FailedLogs');

    XLSX.writeFile(
      workbook,
      `Failed ${group?.data?.name} Bank Validation.xlsx`,
    );
  };

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, []);

  return isLoading ? (
    <LoaderRahat />
  ) : (
    <>
      <RemoveBenfGroupModal
        beneficiaryGroupDetail={group?.data}
        removeModal={removeModal}
      />
      <ValidateBenefBankAccountByGroupUuid
        beneficiaryGroupDetail={group?.data}
        validateModal={validateModal}
        onConfirm={() => {
          sessionStorage.setItem(`bank_validation_${Id}`, 'true');
          setClickedValidateBankAccount(true);
        }}
      />
      <UpdateGroupProposeModal
        beneficiaryGroupDetail={group?.data}
        validateModal={groupProposeModal}
      />
      <AssignBeneficiaryToProjectModal
        beneficiaryGroupDetail={group?.data}
        projectModal={projectModal}
        assignedGroupId={assignedGroupId}
      />
      <GroupNameEditModal
        open={editGroupNameModal.value}
        onOpenChange={editGroupNameModal.setValue}
        beneficiaryGroupDetail={group?.data}
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <Back path="/beneficiary?tab=beneficiaryGroups" />
            <Heading
              title={group?.data?.name}
              description={t('HERE_IS_A_DETAILED_VIEW_OF')}
              status={groupPurposeLabel}
            />
          </div>
          {/* {Number(isAssignedToProject) === 0 && (
            <CoreBtnComponent
              className="text-primary bg-sky-50"
              name="Assign to Project"
              Icon={FolderPlus}
              handleClick={() => {}}
            />
          )} */}
          <div className="flex gap-2">
            {group?.data?.isGroupValidForAA &&
              (group?.data?.groupPurpose === GroupPurpose.BANK_TRANSFER ||
                group?.data?.groupPurpose === GroupPurpose.MOBILE_MONEY) && (
                <Badge className="bg-green-50 text-green-600 flex items-center gap-1">
                  {group?.data?.groupPurpose === GroupPurpose.BANK_TRANSFER && (
                    <>
                      <LandmarkIcon className="h-4 w-4 text-green-600" />
                      {t('BANK_ACCOUNT_VERIFIED')}
                    </>
                  )}
                  {group?.data?.groupPurpose === GroupPurpose.MOBILE_MONEY && (
                    <>
                      <Phone className="h-4 w-4 text-green-600" />
                      {t('PHONE_NUMBER_VERIFIED')}
                    </>
                  )}
                </Badge>
              )}
            {!group?.data?.beneficiaryGroupProject.length && (
              <Button
                variant={'outline'}
                className="gap-2 text-gray-700 rounded-sm"
                onClick={() => editGroupNameModal.onTrue()}
              >
                <Pencil className="w-4 h-4" />
                {t('EDIT')}
              </Button>
            )}
            <Button
              variant={'outline'}
              className={`gap-2 text-gray-700 rounded-sm ${
                (group?.data?.groupedBeneficiaries?.length === 0 ||
                  isAssignToAA) &&
                'hidden'
              }`}
              onClick={handleGroupPurposeClick}
            >
              {groupPurposeName ? t('CHANGE_GROUP_PURPOSE') : t('ASSIGN_GROUP_PURPOSE')}
            </Button>

            {!group?.data?.isGroupValidForAA &&
              (group?.data?.groupPurpose === GroupPurpose.MOBILE_MONEY ||
                group?.data?.groupPurpose === GroupPurpose.BANK_TRANSFER) && (
                <Button
                  variant="outline"
                  className="gap-2 text-gray-700 rounded-sm"
                  onClick={() => {
                    handleAssignModalClick();
                  }}
                >
                  {group.data.groupPurpose === GroupPurpose.MOBILE_MONEY ? (
                    <>
                      <Phone className="w-4 h-4" />
                      {t('VALIDATE_PHONE_NUMBER')}
                    </>
                  ) : (
                    <>
                      <LandmarkIcon className="w-4 h-4" />
                      {t('VALIDATE_BANK_ACCOUNT')}
                    </>
                  )}
                </Button>
              )}
            {group?.data?.isAnyBeneficiaryInvalid && (
              <Button
                variant={'outline'}
                className={` gap-2 text-gray-700 rounded-sm`}
                onClick={onFailedExports}
              >
                <CloudDownloadIcon className="w-4 h-4" /> {t('EXPORT_FAILED')}
              </Button>
            )}

            <Button
              variant={'outline'}
              className={`border-red-500 text-red-500 gap-2 rounded-sm ${
                group?.data?.beneficiaryGroupProject.length > 0 && 'hidden'
              }`}
              onClick={handleRemoveClick}
            >
              <Trash2Icon className="w-4 h-4" />
              {t('DELETE_GROUP')}
            </Button>
            {(group?.data?.isGroupValidForAA || !groupPurposeName) &&
              group?.data?.groupedBeneficiaries?.length !== 0 && (
                <Button
                  variant={'outline'}
                  className="border-blue-500 text-blue-500 gap-2 rounded-sm"
                  onClick={handleProjectAssignModalClick}
                >
                  <FolderDot className="w-4 h-4" />
                  {t('ASSIGN_TO_PROJECT')}
                </Button>
              )}
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <DataCard
            className="border-solid w-1/3 rounded-xl"
            iconStyle="bg-white text-secondary-muted"
            title={t('TOTAL_BENEFICIARIES')}
            Icon={UsersRound}
            number={formatDigits(group?.data?.groupedBeneficiaries?.length)}
          />
          {group?.data?.beneficiaryGroupProject?.length > 0 && (
            <DataCard
              className="border-solid w-1/3 rounded-xl"
              iconStyle="bg-white text-secondary-muted"
              title={t('PROJECT_INVOLVED')}
              Icon={FolderDot}
              refresh={() =>
                syncBeneficiaryGroup.mutate({
                  uuid: Id,
                  successMessage: t('BENEFICIARY_SYNC_STARTED_FOR_PROJECTS'),
                  errorMessage: t('ERROR_WHILE_SYNCING_BENEFICIARY_GROUP'),
                })
              }
            >
              <div className="flex gap-2 flex-wrap">
                {group?.data?.beneficiaryGroupProject?.map(
                  (benProject: any) => (
                    <Badge
                      key={benProject.Project.id}
                      className="text-sm font-normal"
                    >
                      {benProject.Project.name}
                    </Badge>
                  ),
                )}
              </div>
            </DataCard>
          )}
          {isBankTransfer &&
            bankCheckStatus &&
            (bankCheckStatus.pending === 0 || clickedValidateBankAccount) && (
              <div className="border-solid w-1/3 rounded-xl border p-4 text-sm leading-snug">
                {bankCheckStatus.pending > 0 ? (
                  <>
                    <p className="text-muted-foreground font-medium mb-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {t('BANK_VALIDATION_IN_PROGRESS')}
                    </p>
                    <p>
                      {t('CURRENT_STATUS')}:
                      <span className="font-medium">
                        {formatDigits(bankCheckStatus.total - bankCheckStatus.pending)}/
                        {formatDigits(bankCheckStatus.total)}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground font-medium mb-1">
                    {t('BANK_VALIDATION_COMPLETED')}
                  </p>
                )}
                <p className="text-green-600">
                  {t('SUCCESS')}: {formatDigits(bankCheckStatus.success)}
                </p>
                <p className="text-red-500">{t('FAILED')}: {formatDigits(bankCheckStatus.failed)}</p>
              </div>
            )}
        </div>

        <MembersTable
          table={table}
          groupedBeneficiaries={groupedBeneficiaries}
          groupUUID={Id}
          name={group?.data?.name}
          searchValue={filters.name ?? ''}
          isSearching={Boolean(debouncedFilters.name?.trim())}
          onSearch={(value) => setFilters({ name: value })}
        />
      </div>
      <CustomPagination
        meta={group?.data?.response?.meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={group?.data?.response?.meta.total || 0}
      />
    </>
  );
}
