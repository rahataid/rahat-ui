import {
  useBulkCreateDisbursement,
  useFindAllDisbursements,
  usePagination,
  useProjectBeneficiaries,
} from '@rahat-ui/query';
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
import { initialStepData } from './fund-management-flow';
import { useDibsursementList1Columns } from './useDisbursementList1Columns';

export type Payment = {
  name: string;
  disbursementAmount: string;
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
    perPage: 100,
    // pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
  });
  const disbursements = useFindAllDisbursements(id,{
    hideAssignedBeneficiaries: false,
  },);
  const bulkAssignDisbursement = useBulkCreateDisbursement(id);

  const [rowData, setRowData] = React.useState<Payment[]>([]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  // Manage rowData state here
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = useDibsursementList1Columns(rowData, setRowData);
  const table = useReactTable({
    manualPagination: true,
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
          value: Object.keys(e).map((key) => key),
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
    if (
      projectBeneficiaries.isSuccess &&
      projectBeneficiaries.data?.data &&
      disbursements?.isSuccess
    ) {
      const projectBeneficiaryDisbursements =
        projectBeneficiaries.data?.data.map((beneficiary) => {
          const beneficiaryDisbursement = disbursements?.data?.find(
            (disbursement: any) =>
              disbursement.walletAddress === beneficiary.walletAddress,
          );
          return {
            ...beneficiary,
            disbursementAmount: beneficiaryDisbursement?.amount || '0',
          };
        });

      if (
        JSON.stringify(projectBeneficiaryDisbursements) !==
        JSON.stringify(rowData)
      ) {
        setRowData(projectBeneficiaryDisbursements);
      }
    }
  }, [
    disbursements?.data,
    disbursements?.data?.data,
    disbursements?.isSuccess,
    projectBeneficiaries.data?.data,
    projectBeneficiaries.isSuccess,
    rowData,
  ]);

  return (
    <div className="grid grid-cols-12">
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
          bulkAssignDisbursement={bulkAssignDisbursement}
        />
      </div>
    </div>
  );
};

export default DisbursementPlan;
