import { usePagination, useProjectAction } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useElkenyaVendorsTableColumns } from './columns/use.vendors.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import ViewColumns from '../../components/view.columns';
import { MS_ACTIONS } from '@rahataid/sdk';
import Pagination from 'apps/rahat-ui/src/components/pagination';
import ClientSidePagination from '../../components/client.side.pagination';

export default function VendorsView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [data, setData] = React.useState([]);

  const tableData = React.useMemo(() => {
    if (data) return data;
    else return [];
  }, [data]);

  const router = useRouter();
  const getVendors = useProjectAction();
  const handleViewClick = (rowData: any) => {
    router.push(
      `/projects/el-kenya/${id}/vendors/${rowData.walletAddress}?name=${rowData.name}&&phone=${rowData.phone}&&walletAddress=${rowData.walletAddress} &&vendorId=${rowData.id} &&vendorUUID=${rowData.uuid}`,
    );
  };
  const columns = useElkenyaVendorsTableColumns({ handleViewClick });

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
    },
  });

  const fetchVendors = async () => {
    const result = await getVendors.mutateAsync({
      uuid: id,
      data: {
        action: MS_ACTIONS.VENDOR.LIST_BY_PROJECT,
        payload: {},
      },
    });
    console.log({ result });

    const filteredData = result?.data;

    console.log({ filteredData });
    setData(filteredData);
  };

  React.useEffect(() => {
    fetchVendors();
  }, []);
  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-[28px]">Vendors</h1>
          <p className="text-muted-foreground">
            Track all the vendor reports here
          </p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name="vendor"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
            />
            <ViewColumns table={table} />
          </div>
          <ElkenyaTable
            table={table}
            tableHeight="h-[calc(100vh-310px)]"
            loading={getVendors?.isPending}
          />
        </div>
      </div>
      {/* <Pagination
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        setPageSize={table.setPageSize}
        canPreviousPage={table.getCanPreviousPage()}
        previousPage={table.previousPage}
        canNextPage={table.getCanNextPage()}
        nextPage={table.nextPage}
      /> */}
      <ClientSidePagination table={table} />
    </>
  );
}
