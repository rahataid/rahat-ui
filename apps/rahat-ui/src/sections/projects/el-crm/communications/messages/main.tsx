'use client';

import { useState } from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Plus, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { useMsgTableColumn } from './useMsgTableColumns';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useListElCrmCampaign, usePagination } from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function MessagesView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const columns = useMsgTableColumn();
  const { data, meta } = useListElCrmCampaign(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    isScheduled: false,
  });

  const table = useReactTable({
    manualPagination: true,
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Messages
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage your messages
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
                >
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Message
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Compose a new message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No messages created
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first message to get started
              </p>
              <Link
                href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
              >
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Message
                </Button>
              </Link>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <DemoTable table={table} />
                <div className="p-4 border-t">
                  <CustomPagination
                    meta={meta || { total: 0, currentPage: 0 }}
                    handleNextPage={setNextPage}
                    handlePrevPage={setPrevPage}
                    handlePageSizeChange={setPerPage}
                    currentPage={pagination.page}
                    perPage={pagination.perPage}
                    total={meta?.total}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
