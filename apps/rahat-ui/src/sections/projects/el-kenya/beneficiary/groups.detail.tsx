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
import { useBeneficiaryTableColumns } from '../../../beneficiary/useBeneficiaryColumns';
import HeaderWithBack from '../../components/header.with.back';
import { useKenyaGroupedBeneficiaryTableColumns } from './use.grouped.beneficiary.table.columns';

export default function GroupDetailView() {
  const { groupid, id } = useParams() as { groupid: UUID; id: UUID };
  const projectModal = useBoolean();
  const removeModal = useBoolean();

  const { data, isLoading } = useRpSingleBeneficiaryGroup(id, groupid);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  // const columns = useBeneficiaryTableColumns();

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
            path={`/projects/el-kenya/${id}/beneficiary?tab=beneficiaryGroups`}
          />
          {/* <CoreBtnComponent
            className="text-primary bg-sky-50"
            name="Assign to Project"
            Icon={FolderPlus}
            handleClick={() => {}}
          /> */}
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
          groupUUID={groupid}
          name={data?.name}
          loading={isLoading}
        />
      </div>
      <ClientSidePagination table={table} />
    </>
  );
}
