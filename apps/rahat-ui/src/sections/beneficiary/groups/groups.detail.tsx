import * as React from 'react';
import CoreBtnComponent from 'apps/rahat-ui/src/components/core.btn';
import HeaderWithBack from '../../projects/components/header.with.back';
import { FolderPlus, LandmarkIcon, Trash2Icon, UsersRound } from 'lucide-react';
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

export default function GroupDetailView() {
  const { Id } = useParams() as { Id: UUID };
  const validateModal = useBoolean();
  const removeModal = useBoolean();

  const handleAssignModalClick = () => {
    validateModal.onTrue();
  };

  const handleRemoveClick = () => {
    removeModal.onTrue();
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
  const groupedBeneficiaries = [] as any;
  const { data: group } = useGetBeneficiaryGroup(Id);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();

  const tableData = React.useMemo(() => {
    if (group) {
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

  // React.useEffect(() => {
  //   if (groupedBeneficiaries) {
  //     setTableData(groupedBeneficiaries)
  //   }
  //   if (Beneficiaries) {
  //     setTableData(Beneficiaries);
  //   }
  // }, []);
  return (
    <>
      <RemoveBenfGroupModal
        beneficiaryGroupDetail={group?.data}
        removeModal={removeModal}
      />

      <ValidateBenefBankAccountByGroupUuid
        beneficiaryGroupDetail={group?.data}
        validateModal={validateModal}
      />

      <div className="p-4">
        <div className="flex justify-between items-center">
          <HeaderWithBack
            title={group?.data?.name}
            subtitle="Here is a detailed view of the selected beneficiary group"
            path="/beneficiary"
          />
          {Number(isAssignedToProject) === 0 && (
            <CoreBtnComponent
              className="text-primary bg-sky-50"
              name="Assign to Project"
              Icon={FolderPlus}
              handleClick={() => {}}
            />
          )}
          <div className="flex gap-6">
            <Button
              variant={'outline'}
              className="border-red-500 text-red-500 hover:text-red-500 gap-2"
              onClick={handleRemoveClick}
            >
              <Trash2Icon className="w-4 h-4" />
              Delete Group
            </Button>

            <Button
              variant={'outline'}
              className="gap-2"
              onClick={handleAssignModalClick}
            >
              <LandmarkIcon className="w-4 h-4" />
              Validate Bank Account
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
