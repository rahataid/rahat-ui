import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { UUID } from 'crypto';
import { Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { FC, useEffect } from 'react';
import { DisburseTable } from './disburse-table';
import { useDibsursementList1Columns } from './useDisbursementList1Columns';
import { initialStepData } from './fund-management-flow';

export type Payment = {
  name: string;
  amount: string;
  walletAddress: string;
};

interface DisbursementPlanProps {
  handleStepDataChange: (e) => void;
  stepData: typeof initialStepData;
}

const DisbursementPlan: FC<DisbursementPlanProps> = ({
  handleStepDataChange,
  stepData,
}) => {
  const { id } = useParams() as { id: UUID };
  const { pagination, filters } = usePagination();
  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowData, setRowData] = React.useState<any>(
    projectBeneficiaries?.data?.data,
  ); // Manage rowData state here
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = useDibsursementList1Columns(rowData, setRowData);

  const table = useReactTable({
    data: rowData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId(originalRow, index, parent) {
      return originalRow.walletAddress;
    },
    onRowSelectionChange: (e) => {
      setRowSelection(e);
      handleStepDataChange({
        target: {
          name: 'selectedBeneficiaries',
          value: table.getSelectedRowModel().rows.map((row) => {
            const { walletAddress, amount, name } = row.original;
            return {
              walletAddress,
              amount:
                amount !== null && amount !== undefined && amount !== '0'
                  ? amount
                  : stepData.bulkInputAmount || '0',
              name,
            };
          }),
        },
      });
    },
    // onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (projectBeneficiaries.isSuccess && projectBeneficiaries.data.data) {
      setRowData(projectBeneficiaries.data.data);
    }
  }, [projectBeneficiaries]);

  // useEffect(() => {
  //   if (table.getSelectedRowModel().rows.length) {
  //     handleStepDataChange({
  //       target: {
  //         name: 'selectedBeneficiaries',
  //         value: table.getSelectedRowModel().rows.map((row) => row.original),
  //       },
  //     });
  //   }
  // }, [handleStepDataChange, rowSelection, table, table.getSelectedRowModel]);

  return (
    <div className="grid grid-cols-12 p-4">
      <div className="col-span-4">
        <h1 className="mb-4 text-gray-700 text-xl font-medium">
          Create Disbursement Plan
        </h1>
        <DataCard
          className=""
          title="Total beneficiaries"
          number={projectBeneficiaries?.data?.data.length || 'N/A'}
          Icon={Users}
        />
      </div>
      <div className="col-span-12">
        <DisburseTable
          table={table}
          handleStepDataChange={handleStepDataChange}
          stepData={stepData}
        />
      </div>
    </div>
  );
};

export default DisbursementPlan;
