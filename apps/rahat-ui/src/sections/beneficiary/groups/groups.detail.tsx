import * as React from 'react';
import CoreBtnComponent from 'apps/rahat-ui/src/components/core.btn';
import HeaderWithBack from '../../projects/components/header.with.back';
import { FolderPlus, UsersRound } from 'lucide-react';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import MembersTable from './members.table';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useBeneficiaryList, usePagination } from '@rahat-ui/query';
import { useBeneficiaryTableColumns } from '../useBeneficiaryColumns';
import ClientSidePagination from '../../projects/components/client.side.pagination';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function GroupDetailView() {
  const { Id } = useParams() as { Id: UUID };
  const [tableData, setTableData] = React.useState<any>([]);
  const projectModal = useBoolean();
  const removeModal = useBoolean();

  const handleAssignModalClick = () => {
    projectModal.onTrue();
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

  const groupedBeneficiaries = [] as any;
  // const { data: Beneficiaries } = useBeneficiaryList({
  //   ...pagination,
  //   ...filters,
  // });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: groupedBeneficiaries || [],
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
      <div className="p-4">
        <div className="flex justify-between items-center">
          <HeaderWithBack
            title="Beneficiary Group Name Here"
            subtitle="Here is a detailed view of the selected beneficiary group"
            path="/beneficiary"
          />
          <CoreBtnComponent
            className="text-primary bg-sky-50"
            name="Assign to Project"
            Icon={FolderPlus}
            handleClick={() => {}}
          />
        </div>
        <DataCard
          className="border-solid w-1/3 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Beneficiaries"
          Icon={UsersRound}
          number="0"
        />
        <MembersTable
          table={table}
          groupedBeneficiaries={groupedBeneficiaries}
          groupUUID={Id}
        />
      </div>
      <ClientSidePagination table={table} />
    </>
  );
}
