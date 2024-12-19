import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import React, { useEffect } from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';

interface BeneficiaryViewProps {
  disbursmentList: [];
  handleStepDataChange: (e) => void;
}

export default function BeneficiaryView({
  disbursmentList,
  handleStepDataChange,
}: BeneficiaryViewProps) {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = useBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: disbursmentList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((data) => data.original);
    handleStepDataChange({
      target: {
        name: 'disbursements',
        value: selectedRows,
      },
    });
  }, [rowSelection]);

  return (
    <div className="p-4 pt-2">
      <div className="rounded border bg-card p-4">
        <div className="flex justify-between space-x-2 mb-2">
          <SearchInput
            className="w-full"
            name="phone number"
            value={(table.getColumn('phone')?.getFilterValue() as string) ?? ''}
            onSearch={(event) =>
              table.getColumn('phone')?.setFilterValue(event.target.value)
            }
          />
        </div>
        <ElkenyaTable table={table} tableHeight="h-[calc(100vh-520px)]" />
      </div>
    </div>
  );
}
