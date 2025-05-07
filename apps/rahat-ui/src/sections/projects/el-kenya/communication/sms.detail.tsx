import {
  useGetRpCampaign,
  useListRpCampaignLog,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useElkenyaSMSTableColumns } from './use.sms.table.columns';
import React, { useMemo, useState } from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import ViewColumns from '../../components/view.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import HeaderWithBack from '../../components/header.with.back';
import { TriggerConfirmModal } from './confirm.modal';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

export default function CommunicationView() {
  const { id, cid } = useParams() as { id: UUID; cid: UUID };
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

  const { data: campginData } = useGetRpCampaign(id as UUID, cid);
  const { data, isSuccess, isFetching } = useListRpCampaignLog(id as UUID, {
    uuid: cid as string,
    query: {
      page: 1,
      perPage: 1000,
      ...(filters as any),
    },
  });
  const cardData = [
    {
      title: 'Total Message Sent',
      icon: 'MessageSquare',
      total: data?.data?.length || 0,
    },
    {
      title: 'Beneficiaries',
      icon: 'Users',
      total: campginData?.beneficiaryCount || 0,
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
    if (isSuccess && data) {
      let succed = 0;
      let failed = 0;

      return data?.data?.map((item: any) => {
        if (item.status === 'SUCCESS') {
          succed += 1;
        } else if (item.status === 'FAIL') {
          failed += 1;
        }
        setStats({
          succed: succed,
          failed: failed,
        });
        return {
          createdAt: new Date(item.createdAt).toLocaleString(),
          status: item?.status,
          address: item?.address,
        };
      });
    } else {
      return [];
    }
  }, [data, isSuccess]);
  const columns = useElkenyaSMSTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between">
          <HeaderWithBack
            title="SMS Details"
            subtitle="Here is the detailed view of the selected SMS"
            path={`/projects/el-kenya/${id}/communication/manage`}
          />
          <TriggerConfirmModal
            campaignId={cid}
            completed={campginData?.sessionId ? true : false}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {cardData?.map((item, index) => {
            const Icon = getIcon(item.icon as any);
            return (
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
        </div>

        <div>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-start">{campginData?.message}</p>
            </CardContent>
          </Card>
        </div>

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
          </div>
          <ElkenyaTable
            table={table}
            tableHeight="h-[calc(100vh-573px)]"
            loading={isFetching}
          />
        </div>
      </div>
      <CustomPagination
        meta={data?.response.meta || { total: 0, currentPage: 0 }}
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
