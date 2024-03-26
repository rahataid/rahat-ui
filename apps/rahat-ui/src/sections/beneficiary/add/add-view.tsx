'use client';
import { memo, useCallback, useState } from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { usePagination } from '@rahat-ui/query';
import { Beneficiary } from '@rahataid/sdk/types';
import { BENEFICIARY_NAV_ROUTE } from '../../../constants/beneficiary.const';
import { useRumsanService } from '../../../providers/service.provider';
import BeneficiaryDetail from '../../../sections/beneficiary/beneficiaryDetail';
import BeneficiaryNav from '../../../sections/beneficiary/nav';
import AddBeneficiaryForm from './addBeneficiary';
import ImportBeneficiary from '../import.beneficiary';
import { useBeneficiaryTableColumns } from '../useBeneficiaryColumns';

function BeneficiaryView() {
  const { pagination, filters, setPagination } = usePagination((state) => ({
    pagination: state.pagination,
    filters: state.filters,
    setPagination: state.setPagination,
  }));

  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleNextPage = () => setCurrentPage(currentPage + 1);

  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  const { beneficiaryQuery } = useRumsanService();
  const [selectedData, setSelectedData] = useState<Beneficiary>();
  const [active, setActive] = useState<string>(BENEFICIARY_NAV_ROUTE.DEFAULT);

  const handleBeneficiaryClick = useCallback((item: Beneficiary) => {
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  const handleNav = useCallback((item: string) => {
    setActive(item);
    setSelectedData(null);
  }, []);

  const { data } = beneficiaryQuery.useBeneficiaryList({
    perPage,
    page: currentPage,
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const columns = useBeneficiaryTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Tabs defaultValue="list" className="h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-max bg-card">
        <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
          <BeneficiaryNav
            handleNav={handleNav}
            meta={data?.response?.meta}
            active={active}
            table={table}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {active === BENEFICIARY_NAV_ROUTE.IMPORT_BENEFICIARY ? (
            <ImportBeneficiary />
          ) : null}

          <>
            <AddBeneficiaryForm />
          </>
        </ResizablePanel>
        {selectedData ? (
          <>
            <ResizableHandle />
            <ResizablePanel minSize={28} defaultSize={28}>
              {selectedData && (
                <BeneficiaryDetail
                  data={selectedData}
                  handleClose={handleClose}
                />
              )}
              {/* {addBeneficiary && <AddBeneficiary />} */}
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </Tabs>
  );
}

export default memo(BeneficiaryView);
