import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import ElkenyaTable from '../table.component';
import { useElkenyaVendorsBeneficiaryTableColumns } from './columns/use.vendors.beneficiary.table.columns';
import { ClientSidePagination } from '../clientSidePagination';

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
        console.log(beneficiary);
        return {
          phone:
            beneficiary?.piiData?.phone ||
            beneficiary?.Beneficiary?.extras?.phone,
          type:
            beneficiary?.Disbursement?.Beneficiary?.type ||
            beneficiary?.Beneficiary?.type,
          glassesStatus:
            beneficiary?.Disbursement?.Beneficiary?.glassesStatus ||
            beneficiary?.Beneficiary?.glassesStatus,
          voucherStatus:
            beneficiary?.Disbursement?.Beneficiary?.voucherStatus ||
            beneficiary?.Beneficiary?.voucherStatus,
          voucherType: beneficiary?.Beneficiary?.voucherType,
          eyeCheckupStatus: beneficiary?.Beneficiary?.eyeCheckupStatus,
        };
      });
    } else {
      return [];
    }
  }, [beneficiaryList]);

  const columns = useElkenyaVendorsBeneficiaryTableColumns();
  const table = useReactTable({
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  return (
    <div className="p-4 border rounded-sm">
      <ElkenyaTable
        table={table}
        tableHeight="h-[calc(100vh-600px)]"
        loading={loading}
      />
      <ClientSidePagination table={table} />
    </div>
  );
}
