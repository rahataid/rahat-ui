'use client';
import {
  ColumnDef,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRumsanService } from '../../../providers/service.provider';
import { useParams } from 'next/navigation';
import { GroupResponseById } from '@rahataid/community-tool-sdk/groups';
import { Beneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { useState } from 'react';
import GroupDetailTable from '../../../sections/group/group.table';

export const columns: ColumnDef<GroupResponseById[]>[] = [
  {
    accessorKey: 'beneficiary',
    header: 'FullName',
    cell: ({ row }) => {
      if (row && row.getValue && typeof row.getValue === 'function') {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        if (beneficiary && beneficiary.firstName && beneficiary.lastName) {
          return beneficiary.firstName + beneficiary.lastName;
        }
      }
      return '';
    },
  },
  {
    accessorKey: 'beneficiary',
    header: 'WalletAddress',
    cell: ({ row }) => {
      if (row && row.getValue && typeof row.getValue === 'function') {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        if (beneficiary && beneficiary.walletAddress) {
          return beneficiary.walletAddress;
        }
      }
      return '';
    },
  },
  {
    accessorKey: 'beneficiary',
    header: 'customID',
    cell: ({ row }) => {
      if (row && row.getValue && typeof row.getValue === 'function') {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        if (beneficiary && beneficiary.customId) {
          return beneficiary.customId;
        }
      }
      return '';
    },
  },
  {
    accessorKey: 'beneficiaryId',
    header: 'id',
    cell: ({ row }) => <div>{row.getValue('beneficiaryId')}</div>,
  },
];

export default function GroupDetailPage() {
  const { uuid } = useParams();
  const { communityGroupQuery } = useRumsanService();
  const { data } = communityGroupQuery.useCommunityGroupListByID(
    uuid as string,
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.beneficiariesGroup || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="p-4">
      <GroupDetailTable table={table} />
    </div>
  );
}
