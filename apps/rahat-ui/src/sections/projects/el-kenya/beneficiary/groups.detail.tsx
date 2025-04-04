import * as React from 'react';
import CoreBtnComponent from 'apps/rahat-ui/src/components/core.btn';
import { FolderPlus, UsersRound } from 'lucide-react';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import MembersTable from './members.table';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useRpSingleBeneficiaryGroup } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import ClientSidePagination from '../../components/client.side.pagination';
import { useKenyaGroupedBeneficiaryTableColumns } from './use.grouped.beneficiary.table.columns';
import HeaderWithBack from '../../components/header.with.back';

export default function GroupDetailView() {
  const { groupid, id } = useParams() as { groupid: UUID; id: UUID };
  const { data, isLoading } = useRpSingleBeneficiaryGroup(id, groupid);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = useKenyaGroupedBeneficiaryTableColumns();
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
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
    },
  });

  return (
    <>
      <div className="p-2 sm:p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <HeaderWithBack
            title={data?.name || 'N/A'}
            subtitle="Here is a detailed view of the selected consumer group"
            path={`/projects/el-kenya/${id}/beneficiary?tab=beneficiaryGroups`}
          />
        </div>

        <div className="mt-4">
          <DataCard
            className="border-solid w-full sm:w-1/3 rounded-md"
            iconStyle="bg-white text-secondary-muted"
            title="Total Consumers"
            Icon={UsersRound}
            number={data?.groupedBeneficiaries?.length || 0}
          />
        </div>

        <div className="overflow-auto mt-4">
          <MembersTable
            table={table}
            groupedBeneficiaries={data?.groupedBeneficiaries}
            groupUUID={groupid}
            name={data?.name}
            loading={isLoading}
          />
        </div>
      </div>

      <ClientSidePagination table={table} />
    </>
  );
}
