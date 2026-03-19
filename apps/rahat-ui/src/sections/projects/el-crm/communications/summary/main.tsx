'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  Plus,
  MessageSquare,
  CheckCircle,
  XCircle,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { useCommsTableColumn } from './useCommsTableColumn';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useListElCrmCampaign, usePagination } from '@rahat-ui/query';
import { useMsgTableColumn } from '../messages/useMsgTableColumns';

const messageLogs = [
  {
    id: 1,
    date: '2024-01-20',
    channel: 'SMS',
    group: 'Customers',
    templateName: 'Welcome Message',
    status: 'Delivered',
    messageContent:
      "Welcome to our service! We're excited to have you on board. Your account has been successfully created.",
    groupStatus: 'Active customers - 245 recipients',
  },
  {
    id: 2,
    date: '2024-01-19',
    channel: 'WhatsApp',
    group: 'Customers',
    templateName: 'Product Update',
    status: 'Delivered',
    messageContent:
      "We've just launched new features in our app! Check out the latest updates and improvements.",
    groupStatus: 'Active customers - 189 recipients',
  },
  {
    id: 3,
    date: '2024-01-18',
    channel: 'SMS',
    group: 'Customers',
    templateName: 'Reminder',
    status: 'Failed',
    messageContent:
      "Don't forget about your upcoming appointment scheduled for tomorrow at 2:00 PM.",
    groupStatus: 'Inactive customers - 67 recipients',
  },
];

export default function SummaryView() {
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
  });

  const table = useReactTable({
    manualPagination: true,
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Communication Center
            </h1>
            <p className="text-muted-foreground">
              Send messages and track communication logs
            </p>
          </div>
          <Link
            href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Message
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Messages Sent
                  </p>
                  <p className="text-2xl font-bold text-primary">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Delivery Successful
                  </p>
                  <p className="text-2xl font-bold text-success">1,156</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Delivery Failed
                  </p>
                  <p className="text-2xl font-bold text-destructive">91</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Most Used Channel
                  </p>
                  <p className="text-2xl font-bold text-foreground">SMS</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Successful Delivery by Channel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      className="bg-primary/10 text-primary"
                      variant="secondary"
                    >
                      SMS
                    </Badge>
                  </div>
                  <span className="font-semibold text-success">456</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      className="bg-success/10 text-success"
                      variant="secondary"
                    >
                      WhatsApp
                    </Badge>
                  </div>
                  <span className="font-semibold text-success">389</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Failed Delivery by Channel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      className="bg-primary/10 text-primary"
                      variant="secondary"
                    >
                      SMS
                    </Badge>
                  </div>
                  <span className="font-semibold text-destructive">34</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      className="bg-success/10 text-success"
                      variant="secondary"
                    >
                      WhatsApp
                    </Badge>
                  </div>
                  <span className="font-semibold text-destructive">28</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Message Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <DemoTable table={table} />
            <CustomPagination
              meta={meta || { total: 0, currentPage: 0 }}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={meta?.total}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
