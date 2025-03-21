import {
  useListRpCommunicationLogs,
  useProjectStore,
  useSettingsStore,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import Pagination from 'apps/rahat-ui/src/components/pagination';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import { UUID } from 'crypto';
import { Settings } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import SearchInput from '../../components/search.input';
import ViewColumns from '../../components/view.columns';
import ElkenyaTable from '../table.component';
import { useElkenyaSMSTableColumns } from './use.sms.table.columns';
import ClientSidePagination from '../../components/client.side.pagination';

export default function CommunicationView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [stats, setStats] = React.useState({
    succed: 0,
    failed: 0,
  });
  const { data, isLoading } = useListRpCommunicationLogs(id);
  console.log({ data });
  const commsAppId = useSettingsStore((state) => state.commsSettings)?.APP_ID;
  useEffect(() => {
    setStats({
      succed: 0,
      failed: 0,
    });
    data
      ?.filter((log) => log.app === commsAppId)
      .map((logs: any) => {
        setStats((prev) => {
          return logs.status === 'SUCCESS'
            ? { ...prev, succed: prev.succed + 1 }
            : { ...prev, failed: prev.failed + 1 };
        });
      });
  }, [data]);

  const projectClosed = useProjectStore(
    (state) => state.singleProject?.projectClosed,
  );

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
      return data
        .filter((log) => log.app === commsAppId)
        .map((log) => ({
          ...log,
          to:
            (Array.isArray(log?.details?.responses) &&
              (log?.details?.responses[0]?.mobile?.mobile ||
                log?.details?.responses[0]?.mobile)) ||
            (Array.isArray(log?.details?.bulkResponse) &&
              log?.details?.bulkResponse[0]?.mobileNumber),
        }));
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
              value={(table.getColumn('to')?.getFilterValue() as string) ?? ''}
              onSearch={(event) =>
                table.getColumn('to')?.setFilterValue(event.target.value)
              }
            />
            <ViewColumns table={table} />
            <Button
              onClick={() =>
                router.push(`/projects/el-kenya/${id}/communication/manage`)
              }
              disabled={projectClosed}
            >
              <Settings className="mr-1" size={18} /> Manage
            </Button>
          </div>
          <ElkenyaTable
            table={table}
            tableHeight="h-[calc(100vh-421px)]"
            loading={isLoading}
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
