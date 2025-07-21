'use client';
import React, { useState } from 'react';

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
import { UUID } from 'crypto';
import { useSingleBeneficiaryGroup } from '@rahat-ui/query';
import {
  ClientSidePagination,
  DataCard,
  DemoTable,
  HeaderWithBack,
  SearchInput,
} from 'apps/rahat-ui/src/common';

type Props = {};

const BeneficiaryGroupsDetails = (props: Props) => {
  const params = useParams();
  const projectId = params.id as UUID;
  const groupId = params.groupId as UUID;
  const { data: groupDetails, isLoading } = useSingleBeneficiaryGroup(
    projectId,
    groupId,
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useProjectBeneficiaryGroupDetailsTableColumns();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const tableData = React.useMemo(() => {
    if (groupDetails) {
      return groupDetails?.beneficiaries?.map((d: any) => ({
        walletAddress: d?.beneficiary?.walletAddress,
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

  const handleSearch = (e) => {
    console.log(e.target.value);
  };
  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={groupDetails?.name}
          subtitle="Detailed view of the selected beneficiary group"
          path={`/projects/aa/${projectId}/beneficiary?tab=beneficiaryGroups`}
        />
      </div>
      <div className="flex gap-6 mb-5">
        <DataCard
          className="border-solid w-1/4 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Beneficiaries"
          Icon={User}
          number={groupDetails?.beneficiaries?.length || 0}
        />
        <DataCard
          className="border-solid w-1/4 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Token Assigned"
          Icon={Coins}
          number={groupDetails?.tokensReserved || 0}
        />
      </div>
      <div className="p-4 rounded-sm border">
        <SearchInput
          className="w-full m-1"
          name="walletAddress"
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
    </div>
  );
};

export default BeneficiaryGroupsDetails;
