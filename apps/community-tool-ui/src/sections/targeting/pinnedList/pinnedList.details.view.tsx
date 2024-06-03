'use client';
import { useState } from 'react';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  useDownloadPinnedListBeneficiary,
  useExportPinnedListBeneficiary,
  useTargetedBeneficiaryList,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  ArrowUpRightIcon,
  ArrowUpRightSquareIcon,
  Download,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import * as XLSX from 'xlsx';
import CustomPagination from '../../../components/customPagination';
import DetailsTable from './detailsTable';
import { useTargetPinnedListDetailsTableColumns } from './useTargetLabelColumns';

export default function PinnedListDetailsView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const { uuid } = useParams();

  const { data: beneficiaryData } = useTargetedBeneficiaryList(uuid as string, {
    ...pagination,
  });
  const columns = useTargetPinnedListDetailsTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const downloadPinnedListBeneficiary = useDownloadPinnedListBeneficiary();
  const exportPinnedListBeneficiary = useExportPinnedListBeneficiary();

  const table = useReactTable({
    manualPagination: true,
    data: beneficiaryData?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => String(row.targetUuid),
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const downloadPinnedListBeneficiaryByLabel = async () => {
    const response = await downloadPinnedListBeneficiary.mutateAsync({
      target_uuid: uuid as string,
      config: { responseType: 'arraybuffer' },
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(response?.data?.data);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'label.xlsx');
  };

  const handleExportPinnedBeneficiary = () => {
    exportPinnedListBeneficiary.mutate(uuid as string);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 pb-0">
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                asChild
                onClick={downloadPinnedListBeneficiaryByLabel}
              >
                <Download
                  className="cursor-pointer"
                  size={20}
                  strokeWidth={2}
                  color="#007bb6"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild onClick={handleExportPinnedBeneficiary}>
                <ArrowUpRightIcon
                  className="cursor-pointer icon-button"
                  size={20}
                  strokeWidth={2}
                  color="#007bb6"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Export Pinned Beneficiaries</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <DetailsTable table={table} />

      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={beneficiaryData?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={beneficiaryData?.response?.meta?.total || 0}
      />
    </>
  );
}
