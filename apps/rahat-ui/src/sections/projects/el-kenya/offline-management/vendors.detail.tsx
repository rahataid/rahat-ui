import React from 'react';
import { useParams } from 'next/navigation';
import { UsersRound } from 'lucide-react';
import HeaderWithBack from '../../components/header.with.back';
import SearchInput from '../../components/search.input';
import ElkenyaTable from '../table.component';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useVendorsTableColumns } from './use.vendors.table.columns';
import { useGetOfflineSingleVendor, usePagination } from '@rahat-ui/query';
import { UUID } from 'crypto';

const cardData = [
  'Offline Beneficiaries',
  'Vouchers Assigned',
  'Voucher Numbers',
];

export default function VendorsDetail() {
  const { id, vid } = useParams();
  const columns = useVendorsTableColumns();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowData, setRowData] = React.useState([]);
  const { data: offlineVendor, isSuccess } = useGetOfflineSingleVendor(
    id as UUID,
    Number(vid),
  );
  const cardData = [
    { name: 'Offline Beneficiaries', value: offlineVendor?.data.length },
    {
      name: 'Vouchers Assigned',
      value: offlineVendor.extras.totalAmountAssigned,
    },
    {
      name: 'Voucher Numbers',
      value: offlineVendor.extras.totalAmountAssigned,
    },
  ];
  React.useEffect(() => {
    if (offlineVendor?.data.length > 0) {
      const benDetails = offlineVendor?.data.map((ben: any) => {
        return {
          amount: ben?.amount,
          name: ben?.piiData?.name,
          status: ben?.status,
        };
      });
      if (JSON.stringify(benDetails) !== JSON.stringify(rowData)) {
        setRowData(benDetails);
      }
    }
  }, [offlineVendor?.data, rowData]);
  const table = useReactTable({
    manualPagination: true,
    data: rowData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      // rowSelection: selectedListItems,
    },
  });
  return (
    <div className="m-4">
      <HeaderWithBack
        title="Vendor details"
        subtitle="Here is the detailed view of selected vendor"
        path={`/projects/el-kenya/${id}/vendors`}
      />
      <div className="p-4 grid grid-cols-3 gap-4 mb-5">
        {cardData?.map((d) => (
          <div className="rounded-sm bg-card p-4 shadow-md">
            <div className="flex justify-between items-center">
              <h1 className="text-sm">{d.name}</h1>
              <div className="p-1 rounded-full bg-secondary">
                <UsersRound size={16} strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-primary font-semibold text-xl">{d.value}</p>
          </div>
        ))}
      </div>
      <div className="mb-5">
        <h1 className=" font-semibold text-xl ">Offline Beneficiary</h1>
        <p className="text-muted-foreground text-base">
          List of offline beneficiaries
        </p>
      </div>
      <div className="rounded border bg-card p-4">
        <div className="flex justify-between space-x-2 mb-2">
          <SearchInput className="w-full" name="vendor" onSearch={() => {}} />
        </div>
        <ElkenyaTable table={table} tableHeight="h-[calc(100vh-500px)]" />
      </div>
    </div>
  );
}