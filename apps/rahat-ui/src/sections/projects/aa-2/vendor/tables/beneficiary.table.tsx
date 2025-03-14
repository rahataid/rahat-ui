import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { useVendorsBeneficiaryTableColumns } from '../columns/useBeneficiaryColumns';
import {
  ClientSidePagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';

interface VendorsBeneficiaryListProps {
  beneficiaryList: any;
  loading?: boolean;
}

export default function VendorsBeneficiaryList({
  beneficiaryList,
  loading,
}: VendorsBeneficiaryListProps) {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const tableData = useMemo(() => {
    if (beneficiaryList?.length > 0) {
      return beneficiaryList.map((beneficiary: any) => {
        return {
          phone: beneficiary?.piiData?.phone,
          type:
            beneficiary?.Disbursement?.Beneficiary?.type ||
            beneficiary?.Beneficiary?.type,
          glassesStatus:
            beneficiary?.Disbursement?.Beneficiary?.glassesStatus ||
            beneficiary?.Beneficiary?.glassesStatus,
          voucherStatus:
            beneficiary?.Disbursement?.Beneficiary?.voucherStatus ||
            beneficiary?.Beneficiary?.voucherStatus,
        };
      });
    } else {
      return [];
    }
  }, [beneficiaryList]);

  const columns = useVendorsBeneficiaryTableColumns();
  const table = useReactTable({
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  return (
    <div className="">
      <Heading
        title="Offline Beneficiaries"
        titleStyle="text-lg"
        description="List of all the offline beneficiaries"
      />
      <SearchInput
        className="w-full"
        name=""
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onSearch={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
      />
      <DemoTable
        table={table}
        tableHeight={
          tableData?.length > 0
            ? 'h-[calc(100vh-380px)]'
            : 'h-[calc(100vh-800px)]'
        }
        loading={loading}
      />
      <ClientSidePagination table={table} />
    </div>
  );
}
