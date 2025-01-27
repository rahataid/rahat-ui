import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  usePagination,
  useStakeholdersGroups,
  useStakeholdersGroupsStore,
} from '@rahat-ui/query';
import StakeholdersGroupsTable from '../groups.table';
import useStakeholdersGroupsTableColumn from './useStakeholdersGroupsTableColumn';
import CustomPagination from '../../../../../components/customPagination';
import { UUID } from 'crypto';
import { getPaginationFromLocalStorage } from '../../prev.pagination.storage';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

export default function StakeholdersGroupsListView() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  React.useEffect(() => {
    const isBackFromDetail = searchParams.get('backFromDetail') === 'true';
    const prevPagination = getPaginationFromLocalStorage(isBackFromDetail);
    setPagination(prevPagination);
  }, []);

  const {isLoading} = useStakeholdersGroups(id as UUID, { ...pagination });

  const { stakeholdersGroups, stakeholdersGroupsMeta } =
    useStakeholdersGroupsStore((state) => ({
      stakeholdersGroups: state.stakeholdersGroups,
      stakeholdersGroupsMeta: state.stakeholdersGroupsMeta,
    }));

  const columns = useStakeholdersGroupsTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: stakeholdersGroups ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className='flex items-center justify-center mt-60'>
        <TableLoader />
      </div>
    )
  }

  return (
    <div className="rounded border bg-card">
      <StakeholdersGroupsTable table={table} />
      <CustomPagination
        meta={
          stakeholdersGroupsMeta || {
            total: 0,
            currentPage: 0,
            lastPage: 0,
            perPage: 0,
            next: null,
            prev: null,
          }
        }
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={stakeholdersGroupsMeta?.lastPage || 0}
      />
    </div>
  );
}
