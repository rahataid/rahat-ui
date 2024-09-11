import {
  useBeneficiaryStore,
  useBulkCreateDisbursement,
  useFindAllDisbursements,
  usePagination,
  useProjectBeneficiaries,
} from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
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
import BeneficiaryGroup from './beneficiary.group';
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
  const { pagination, filters, setNextPage, setPrevPage, setPerPage } =
    usePagination();

  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,

    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
  });
  const meta = projectBeneficiaries?.data.response?.meta;

  const disbursements = useFindAllDisbursements(id, {
    hideAssignedBeneficiaries: true,
  });
  const bulkAssignDisbursement = useBulkCreateDisbursement(id);

  const [rowData, setRowData] = React.useState<Payment[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>('beneficiary');

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
    // manualPagination: true,
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
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-4">
        <h1 className="mb-4 text-gray-700 text-xl font-medium">
          Create Disbursement Plan
        </h1>
        <DataCard
          className=""
          title="Total beneficiaries"
          number={projectBeneficiaries?.data?.data.length?.toString() || 'N/A'}
          Icon={Users}
        />
      </div>
      <div className="col-span-12 bg-white p-2">
        <h3 className="mb-4 text-gray-700 text-xl font-medium">
          Beneficiaries
        </h3>
        <p className="text-gray-500 font-normal text-base">
          Here is the list of all the beneficiaries group
        </p>
        <Tabs defaultValue="beneficiary" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList className="bg-secondary gap-4">
              <TabsTrigger
                value="beneficiary"
                className="w-52 bg-card border data-[state=active]:border-primary"
              >
                Beneficiary
              </TabsTrigger>
              <TabsTrigger
                value="beneficiaryGroups"
                className="w-52 bg-card border data-[state=active]:border-primary"
              >
                Beneficiary Groups
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="beneficiary">
            <DisburseTable
              table={table}
              handleStepDataChange={handleStepDataChange}
              stepData={stepData}
              bulkAssignDisbursement={bulkAssignDisbursement}
            />
          </TabsContent>
          <TabsContent value="beneficiaryGroups">
            <BeneficiaryGroup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DisbursementPlan;
