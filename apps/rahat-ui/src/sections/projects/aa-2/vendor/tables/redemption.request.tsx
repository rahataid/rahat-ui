import { useTranslations } from 'next-intl';
import { usePagination, useVendorTokenRedemptionList } from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { CustomPagination, DemoTable, Heading } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import React from 'react';
import { useRedemptionRequestColumn } from '../columns/useRedemptionRequest';

export default function RedemptionRequestTable() {
  const t = useTranslations('AA_PROJECT');
  const { id, vendorId } = useParams();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { pagination, setPagination, setNextPage, setPerPage, setPrevPage } =
    usePagination();

  const { data, isLoading } = useVendorTokenRedemptionList({
    projectUUID: id,
    vendorUuid: vendorId,
    ...pagination,
  });

  const columns = useRedemptionRequestColumn();
  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  return (
    <div className="space-y-1">
      <Heading
        title={t('REDEMPTION_REQUEST')}
        titleStyle="text-lg"
        description={t('REDEMPTION_REQUEST_DESC')}
      />

      <>
        <DemoTable
          table={table}
          tableHeight={'h-[calc(450px)]'}
          loading={isLoading}
        />
        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          setPagination={setPagination}
          meta={{
            total: 0,
            lastPage: 0,
            currentPage: 0,
            perPage: 0,
            prev: null,
            next: null,
          }}
          perPage={pagination?.perPage}
          total={0}
        />
      </>
    </div>
  );
}
