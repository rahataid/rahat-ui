import { UUID } from 'crypto';
import { Settings } from 'lucide-react';
import C2CTable from '../../table.component';
import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SearchInput from '../../../components/search.input';
import ViewColumns from '../../../components/view.columns';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useElkenyaSMSTableColumns } from '../use.sms.table.columns';
import ClientSidePagination from '../../../components/client.side.pagination';
import {
  useListc2cCommunicationLogs,
  useListRpCommunicationLogs,
  usePagination,
  useSettingsStore,
} from '@rahat-ui/query';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
export default function CommunicationView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [stats, setStats] = React.useState({
    succed: 0,
    failed: 0,
  });
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();
  const { data, isLoading } = useListc2cCommunicationLogs(id, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
  });
  console.log({ data });
  const meta = data?.response.meta;
  const logs = data?.response.data;

  const commsAppId = useSettingsStore((state) => state.commsSettings)?.APP_ID;
  // useEffect(() => {
  //   setStats({
  //     succed: 0,
  //     failed: 0,
  //   });
  //   data
  //     ?.filter((log) => log.app === commsAppId)
  //     .map((logs: any) => {
  //       setStats((prev) => {
  //         return logs.status === 'SUCCESS'
  //           ? { ...prev, succed: prev.succed + 1 }
  //           : { ...prev, failed: prev.failed + 1 };
  //       });
  //     });
  // }, [data]);

  const cardData = [
    {
      title: 'Total Message Sent',
      icon: 'MessageSquare',
      total: stats.failed + stats.succed || 0,
    },
    {
      title: 'Failed Message Delivery',
      icon: 'MessageSquare',
      total: stats.failed,
    },
    {
      title: 'Successfull Messages Delivered',
      icon: 'CircleCheck',
      total: stats.succed,
    },
  ];

  const tableData = useMemo(() => {
    if (data) {
      return logs.filter((log) => log.app === commsAppId);
    } else {
      return [];
    }
  }, [data]);

  const columns = useElkenyaSMSTableColumns();
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
    },
  });
  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Communication</h1>
        </div>
        {/* <div className="grid grid-cols-3 gap-2 mb-4">
          {cardData?.map((item, index) => {
            const Icon = getIcon(item.icon as any);
            return (
              // <div key={index} className="rounded-sm bg-card p-4 shadow-md">
              //   <div className="flex justify-between items-center">
              //     <h1 className="text-sm">{item.title}</h1>
              //     <div className="p-1 rounded-full bg-secondary text-primary">
              //       <Icon size={16} strokeWidth={2.5} />
              //     </div>
              //   </div>
              //   <p className="text-primary font-semibold text-xl">
              //     {item.total}
              //   </p>
              // </div>
              <DataCard
                className="border-solid rounded-sm"
                iconStyle="text-muted-foreground bg-white "
                key={index}
                title={item.title}
                Icon={Icon}
                number={item.total}
              />
            );
          })}
        </div> */}

        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name=""
              value={
                (table.getColumn('address')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event) =>
                table.getColumn('address')?.setFilterValue(event.target.value)
              }
            />
            <ViewColumns table={table} />
            <Button
              onClick={() =>
                router.push(`/projects/c2c/${id}/communication/text/manage`)
              }
            >
              <Settings className="mr-1" size={18} /> Manage
            </Button>
          </div>
          <C2CTable
            table={table}
            tableHeight="h-[calc(100vh-421px)]"
            loading={isLoading}
          />
        </div>
      </div>
      <CustomPagination
        meta={meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </>
  );
}
