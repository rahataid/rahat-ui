import * as React from 'react';
import CoreBtnComponent from 'apps/rahat-ui/src/components/core.btn';
import HeaderWithBack from '../../projects/components/header.with.back';
import {
  CloudDownloadIcon,
  FolderPlus,
  LandmarkIcon,
  Trash2Icon,
  UsersRound,
  Phone,
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
  useBeneficiaryList,
  useExportBeneficiariesFailedBankAccount,
  useGetBeneficiaryGroup,
  usePagination,
} from '@rahat-ui/query';
import { useBeneficiaryTableColumns } from '../useBeneficiaryColumns';
import ClientSidePagination from '../../projects/components/client.side.pagination';
import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import RemoveBenfGroupModal from './removeGroupModal';
import ValidateBenefBankAccountByGroupUuid from './validateAccountModal';
import * as XLSX from 'xlsx';
import UpdateGroupProposeModal from './groupProposeModal';
import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { GroupPurpose } from 'apps/rahat-ui/src/constants/beneficiary.const';
export default function GroupDetailView() {
  const { Id } = useParams() as { Id: UUID };
  const validateModal = useBoolean();
  const removeModal = useBoolean();
  const groupProposeModal = useBoolean();

  const handleAssignModalClick = () => {
    validateModal.onTrue();
  };

  const handleRemoveClick = () => {
    removeModal.onTrue();
  };

  const handleGroupPurposeClick = () => {
    groupProposeModal.onTrue();
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

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, []);

  const searchParams = useSearchParams();

  const isAssignedToProject = searchParams.get('isAssignedToProject');
  const isGroupValidForAA = searchParams.get('isGroupValidForAA');
  const groupedBeneficiaries = [] as any;
  const { data: group, isLoading } = useGetBeneficiaryGroup(Id);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();
  const { data } = useExportBeneficiariesFailedBankAccount(Id);
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

  const groupPurposeName = group?.data?.groupPurpose?.split('_')[0];

  // React.useEffect(() => {
  //   if (groupedBeneficiaries) {
  //     setTableData(groupedBeneficiaries)
  //   }
  //   if (Beneficiaries) {
  //     setTableData(Beneficiaries);
  //   }
  // }, []);

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

  return isLoading ? (
    <TableLoader />
  ) : (
    <>
      <RemoveBenfGroupModal
        beneficiaryGroupDetail={group?.data}
        removeModal={removeModal}
      />

      <ValidateBenefBankAccountByGroupUuid
        beneficiaryGroupDetail={group?.data}
        validateModal={validateModal}
      />

      <UpdateGroupProposeModal
        beneficiaryGroupDetail={group?.data}
        validateModal={groupProposeModal}
      />

      <div className="p-4">
        <div className="flex justify-between items-center">
          {/* <HeaderWithBack
            title={group?.data?.name}
            subtitle="Here is a detailed view of the selected beneficiary group"
            path="/beneficiary?tab=beneficiaryGroups"
          /> */}
          <div>
            <Back path="/beneficiary?tab=beneficiaryGroups" />
            <Heading
              title={group?.data?.name}
              description={
                'Here is a detailed view of the selected beneficiary group'
              }
              status={capitalizeFirstLetter(groupPurposeName || '')}
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
                      Bank Account Verified
                    </>
                  )}
                  {group?.data?.groupPurpose === GroupPurpose.MOBILE_MONEY && (
                    <>
                      <Phone className="h-4 w-4 text-green-600" />
                      Phone Number Verified
                    </>
                  )}
                </Badge>
              )}
            <Button
              variant={'outline'}
              className={`gap-2 text-gray-700 rounded-sm ${
                group?.data?.groupedBeneficiaries?.length === 0 && 'hidden'
              }`}
              onClick={handleGroupPurposeClick}
            >
              {groupPurposeName ? 'Change ' : 'Assign '}
              Group Purpose
            </Button>

            {!group?.data?.isGroupValidForAA &&
              (group?.data?.groupPurpose === GroupPurpose.MOBILE_MONEY ||
                group?.data?.groupPurpose === GroupPurpose.BANK_TRANSFER) && (
                <Button
                  variant="outline"
                  className="gap-2 text-gray-700 rounded-sm"
                  onClick={handleAssignModalClick}
                >
                  {group.data.groupPurpose === GroupPurpose.MOBILE_MONEY ? (
                    <>
                      <Phone className="w-4 h-4" />
                      Validate Phone Number
                    </>
                  ) : (
                    <>
                      <LandmarkIcon className="w-4 h-4" />
                      Validate Bank Account
                    </>
                  )}
                </Button>
              )}
            <Button
              variant={'outline'}
              className={`${
                (group?.data?.isGroupValidForAA ||
                  group?.data?.groupedBeneficiaries?.length === 0) &&
                'hidden'
              } gap-2 text-gray-700 rounded-sm`}
              onClick={onFailedExports}
            >
              <CloudDownloadIcon className="w-4 h-4" /> Export Failed
            </Button>
            <Button
              variant={'outline'}
              className="border-red-500 text-red-500 gap-2 rounded-sm"
              onClick={handleRemoveClick}
            >
              <Trash2Icon className="w-4 h-4" />
              Delete Group
            </Button>
          </div>
        </div>
        <DataCard
          className="border-solid w-1/3 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Beneficiaries"
          Icon={UsersRound}
          number={group?.data?.groupedBeneficiaries?.length}
        />
        <MembersTable
          table={table}
          groupedBeneficiaries={groupedBeneficiaries}
          groupUUID={Id}
          name={group?.data?.name}
        />
      </div>
      <ClientSidePagination table={table} />
    </>
  );
}
