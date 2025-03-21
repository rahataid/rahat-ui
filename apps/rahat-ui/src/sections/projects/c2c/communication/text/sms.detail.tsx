import { UUID } from 'crypto';
import ElkenyaTable from '../../table.component';
import React, { useMemo, useState } from 'react';
import { TriggerConfirmModal } from './confirm.modal';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import { useParams, useRouter } from 'next/navigation';
import SearchInput from '../../../components/search.input';
import ViewColumns from '../../../components/view.columns';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import HeaderWithBack from '../../../components/header.with.back';
import { useElkenyaSMSTableColumns } from '../use.sms.table.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

import {
  useGetc2cCampaign,
  useListc2cCampaignLog,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

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

  const { data: campginData } = useGetc2cCampaign(id as UUID, cid);
  const { data, isSuccess, isLoading } = useListc2cCampaignLog(id as UUID, {
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
        if (item.isComplete) {
          succed += 1;
        } else {
          failed += 1;
        }
        setStats({
          succed: succed,
          failed: failed,
        });
        return {
          createdAt: new Date(item.createdAt).toLocaleString(),
          status: item?.status,
          to: item?.address,
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
            path={`/projects/c2c/${id}/communication/text/manage`}
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
              value={(table.getColumn('to')?.getFilterValue() as string) ?? ''}
              onSearch={(event) =>
                table.getColumn('to')?.setFilterValue(event.target.value)
              }
            />
            <ViewColumns table={table} />
          </div>
          <ElkenyaTable
            table={table}
            tableHeight="h-[calc(100vh-573px)]"
            loading={isLoading}
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
