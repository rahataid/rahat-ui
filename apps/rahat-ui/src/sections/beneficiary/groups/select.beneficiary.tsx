import { useParams, useRouter } from 'next/navigation';
import HeaderWithBack from '../../projects/components/header.with.back';
import { UUID } from 'crypto';
import SearchInput from '../../projects/components/search.input';
import {
  useBeneficiaryList,
  usePagination,
  useUpdateBeneficiaryGroup,
} from '@rahat-ui/query';
import React from 'react';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useBeneficiaryTableColumns } from '../useBeneficiaryColumns';
import ViewColumns from '../../projects/components/view.columns';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/useNumberFormat';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

export default function SelectBeneficiaryView() {
  const { Id } = useParams() as { Id: UUID };
  const router = useRouter();
  const t = useTranslations('GLOBAL');
  const formatDigits = useLabelDigits();

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, [setPagination]);

  const debouncedFilters = useDebounce(filters, 500);
  const { data: Beneficiaries } = useBeneficiaryList({
    ...pagination,
    ...debouncedFilters,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: Beneficiaries?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const updateBeneficiaryGroup = useUpdateBeneficiaryGroup();

  const handleUpdateBeneficiaryGroup = async () => {
    const members = Object.entries(selectedListItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([uuid]) => ({ uuid }));
    const payload = {
      uuid: Id,
      beneficiaries: members,
      successMessage: t('BENEFICIARY_GROUP_UPDATED_SUCCESSFULLY'),
      errorMessage: t('ERROR_WHILE_UPDATING_BENEFICIARY_GROUP'),
    };
    try {
      await updateBeneficiaryGroup.mutateAsync(payload);
    } catch (e) {
      console.error('Error while updating beneficiary group::', e);
    }
  };

  React.useEffect(() => {
    if (updateBeneficiaryGroup.isSuccess)
      router.push(`/beneficiary/groups/${Id}`);
  }, [updateBeneficiaryGroup]);
  return (
    <>
      <div className="p-4">
        <HeaderWithBack
          title={t('SELECT_BENEFICIARY')}
          subtitle={t('SELECT_BENEFICIARIES_FROM_THE_LIST_BELOW')}
          path={`/beneficiary/groups/${Id}`}
        />
        <div className="border rounded shadow p-3">
          <div className="flex space-x-2 items-center mb-2">
            <SearchInput
              name={t('BENEFICIARY')}
              value={filters?.name ?? ''}
              onSearch={(event) =>
                setFilters({ ...filters, name: event.target.value })
              }
              className="rounded w-full"
            />
            <ViewColumns table={table} />
            {/* <DatePicker
            placeholder="Pick Start Date"
            handleDateChange={handleDateChange}
            type="start"
          />
          <DatePicker
            placeholder="Pick End Date"
            handleDateChange={handleDateChange}
            type="end"
          /> */}
          </div>
          <DemoTable table={table} tableHeight="h-[calc(100vh-355px)]" />
          <CustomPagination
            meta={Beneficiaries?.response?.meta || { total: 0, currentPage: 0 }}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            total={Beneficiaries?.response?.meta.total || 0}
          />
        </div>
      </div>
      <div className="flex justify-between items-center py-2 px-4 border-t">
        <p>
          {t('SELECTED')} {formatDigits(Object.keys(selectedListItems).length ?? 0)}
        </p>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/beneficiary/groups/${Id}`)}
          >
            {t('CANCEL')}
          </Button>
          {/* {addBeneficiary.isPending ? (
        <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
        </Button>
        ) : ( */}

          <Button className="px-10" onClick={handleUpdateBeneficiaryGroup}>
            {t('ADD_BENEFICIARIES2')} (
            {formatDigits(Object.keys(selectedListItems).length ?? 0)}{' '}
            {t('BENEFICIARIES')} )
          </Button>
          {/* )} */}
        </div>
      </div>
    </>
  );
}
