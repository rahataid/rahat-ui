'use client';

import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  useVendorList,
  usePagination,
  useAssignVendorToProject,
} from '@rahat-ui/query';
import { useBoolean } from '../../hooks/use-boolean';
import { UUID } from 'crypto';
import { useTableColumns } from './useTableColumns';
import VendorsTable from './vendors.list.table';
import CustomPagination from '../../components/customPagination';
import { useDebounce } from '@rahat-ui/shadcn/src/components/custom/multi-select';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { useTranslations } from 'next-intl';
import { ReusableTabs } from '../../components/reusable-tabs';
import { BarChart3, List } from 'lucide-react';
import VendorStats from './vendor.stats';

function VendorsView() {
  const t = useTranslations('VENDORS_LIST');
  const g = useTranslations('GLOBAL');
  const { activeTab, setActiveTab } = useActiveTab('list');
  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  const projectModal = useBoolean();
  const [refetch, setRefetch] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const statusFilter =
    (columnFilters.find((filter) => filter.id === 'status')?.value as string) ||
    '';
  const projectFilter =
    (columnFilters.find((filter) => filter.id === 'projectName')
      ?.value as string) || '';
  const vendorNameFilter =
    (columnFilters.find((filter) => filter.id === 'name')?.value as string) ||
    '';

  // Reset to page 1 whenever server-side filters change
  React.useEffect(() => {
    setPagination({ ...pagination, page: 1 });
  }, [statusFilter, projectFilter, vendorNameFilter]);

  const debouncedNameSearch = useDebounce(vendorNameFilter, 500);

  const vendorPayload = React.useMemo(
    () => ({
      ...pagination,
      ...(debouncedNameSearch && { vendorName: debouncedNameSearch }),
      ...(statusFilter && { status: statusFilter }),
      ...(projectFilter && { projectName: projectFilter }),
    }),
    [pagination, debouncedNameSearch, statusFilter, projectFilter],
  );

  const addVendor = useAssignVendorToProject();
  const { data: vendorData } = useVendorList(vendorPayload, refetch);

  const [selectedProject, setSelectedProject] = React.useState<UUID>();
  const [selectedRow, setSelectedRow] = React.useState(null) as any;

  const handleAssignModalClick = (row: any) => {
    setSelectedRow(row);
    projectModal.onTrue();
  };
  const handleAssignProject = async () => {
    if (!selectedProject) return alert(g('PLEASE_SELECT_A_PROJECT'));
    await addVendor.mutateAsync({
      vendorUUID: selectedRow?.id,
      projectUUID: selectedProject,
      successMessage: g('VENDOR_ASSIGNED_SUCCESSFULLY'),
      errorMessage: g('ERROR_WHILE_UPDATING_VENDOR'),
    });
    projectModal.onFalse();
    setRefetch(!refetch);
  };
  const columns = useTableColumns(handleAssignModalClick);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: vendorData?.data || [],
    manualPagination: true,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const tabItems = [
    {
      value: 'list',
      label: t('LIST'),
      icon: <List size={14} />,
      content: (
        <>
          <VendorsTable
            table={table}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            handleAssignProject={handleAssignProject}
            projectModal={projectModal}
            selectedRow={selectedRow}
            total={vendorData?.response?.meta?.total ?? 0}
          />
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePageSizeChange={setPerPage}
            handlePrevPage={setPrevPage}
            meta={vendorData?.response?.meta || {}}
            perPage={pagination.perPage}
          />
        </>
      ),
    },
    {
      value: 'stats',
      label: t('STATS'),
      icon: <BarChart3 size={14} />,
      content: <VendorStats />,
    },
  ];

  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl text-label">{t('VENDORS')}</h1>
          <p className="text-sub-label">{t('HERE_IS_THE_LIST_OF_ALL')}</p>
        </div>
        <ReusableTabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          items={tabItems}
        />
      </div>
    </>
  );
}

export default React.memo(VendorsView);
