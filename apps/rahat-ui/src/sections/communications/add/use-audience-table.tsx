import { rankItem } from '@tanstack/match-sorter-utils';
import {
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';

type IProps = {
  tableData: any;
  columns: any;
  setGlobalFilter: any;
  globalFilter: any;
  setColumnVisibility: any;
  columnVisibility: any;
  setRowSelection: any;
  rowSelection: any;
};

export const useAudienceTable = ({
  tableData,
  columns,
  setGlobalFilter,
  globalFilter,
  setColumnVisibility,
  columnVisibility,
  setRowSelection,
  rowSelection,
}: IProps) => {
  const audienceFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    let itemRank = rankItem(row.getValue(columnId), value);
    if (!itemRank.passed) {
      itemRank = rankItem(row.getValue('phone'), value); //TODO:make dynamic
    }

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };
  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: audienceFilter,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,

    filterFns: {
      fuzzy: audienceFilter,
    },
    state: {
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });
  return table;
};
