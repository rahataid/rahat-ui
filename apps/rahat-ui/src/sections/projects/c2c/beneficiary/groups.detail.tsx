import { UUID } from 'crypto';
import * as React from 'react';
import { UsersRound } from 'lucide-react';
import { useParams } from 'next/navigation';
import MembersTable from '../../components/members.table';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  useC2CSingleBeneficiaryGroup,
  useRpSingleBeneficiaryGroup,
} from '@rahat-ui/query';
import HeaderWithBack from '../../components/header.with.back';
import ClientSidePagination from '../../components/client.side.pagination';
import { useGroupedBeneficiaryTableColumns } from '../../components/use.grouped.beneficiary.table.columns';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

export default function GroupDetailView() {
  const { groupid, id } = useParams() as { groupid: UUID; id: UUID };

  const { data, isLoading } = useC2CSingleBeneficiaryGroup(id, groupid);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = useGroupedBeneficiaryTableColumns();
  const tableData = React.useMemo(() => {
    if (data) {
      return data?.groupedBeneficiaries?.map((d: any) => ({
        uuid: d?.Beneficiary?.uuid,
        name: d?.Beneficiary?.pii?.name,
        phone: d?.Beneficiary?.pii?.phone,
        email: d?.Beneficiary?.pii?.email,
        location: d?.Beneficiary?.location,
        gender: d?.Beneficiary?.gender,
        walletAddress: d?.Beneficiary?.walletAddress,
        internetStatus: d?.Beneficiary?.internetStatus,
        phoneStatus: d?.Beneficiary?.phoneStatus,
        bankedStatus: d?.Beneficiary?.bankedStatus,
      }));
    } else return [];
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      // rowSelection: selectedListItems,
    },
  });

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <HeaderWithBack
            title={data?.name || 'N/A'}
            subtitle="Here is a detailed view of the selected beneficiary group"
            path={`/projects/c2c/${id}/beneficiary?tab=beneficiaryGroups`}
          />
        </div>
        <DataCard
          className="border-solid w-1/3 rounded-md"
          iconStyle="bg-white text-secondary-muted"
          title="Total Beneficiaries"
          Icon={UsersRound}
          number={data?.groupedBeneficiaries?.length || 0}
        />
        <MembersTable
          table={table}
          groupedBeneficiaries={data?.groupedBeneficiaries}
          loading={isLoading}
          path={`/projects/c2c/${id}/beneficiary/group/${groupid}/select?name=${data?.name}`}
        />
      </div>
      <ClientSidePagination table={table} />
    </>
  );
}
