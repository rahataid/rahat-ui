import { useRouter } from 'next/navigation';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Dialog,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Expand, Minus, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../components/dialog';
import { paths } from '../../routes/paths';
import {
  GroupResponseById,
  ListGroup,
} from '@rahataid/community-tool-sdk/groups';
import { useRumsanService } from '../../providers/service.provider';
import {
  ColumnDef,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { Beneficiary } from '@rahataid/community-tool-sdk/beneficiary';

import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import GroupDetailTable from './group.table';
type IProps = {
  data: ListGroup;
  handleClose: VoidFunction;
};

export const columns: ColumnDef<GroupResponseById[]>[] = [
  {
    accessorKey: 'beneficiary',
    header: 'FullName',
    cell: ({ row }) => {
      if (row && row.getValue && typeof row.getValue === 'function') {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        if (beneficiary && beneficiary.firstName && beneficiary.lastName) {
          return beneficiary.firstName + beneficiary.lastName;
        }
      }
      return '';
    },
  },
  {
    accessorKey: 'beneficiary',
    header: 'WalletAddress',
    cell: ({ row }) => {
      if (row && row.getValue && typeof row.getValue === 'function') {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        if (beneficiary && beneficiary.walletAddress) {
          return beneficiary.walletAddress;
        }
      }
      return '';
    },
  },
  {
    accessorKey: 'beneficiary',
    header: 'customID',
    cell: ({ row }) => {
      if (row && row.getValue && typeof row.getValue === 'function') {
        const beneficiary = row.getValue('beneficiary') as Beneficiary;
        if (beneficiary && beneficiary.customId) {
          return beneficiary.customId;
        }
      }
      return '';
    },
  },
  {
    accessorKey: 'beneficiaryId',
    header: 'id',
    cell: ({ row }) => <div>{row.getValue('beneficiaryId')}</div>,
  },
];

export default function GroupDetail({ data, handleClose }: IProps) {
  const router = useRouter();
  const { communityGroupQuery } = useRumsanService();
  const { data: responseByUUID } =
    communityGroupQuery.useCommunityGroupListByID(data.uuid);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    manualPagination: true,
    data: responseByUUID?.data?.beneficiariesGroup || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger onClick={handleClose}>
                  <Minus size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    router.push(
                      paths.dashboard.beneficiary.detail(data?.id.toString()),
                    );
                  }}
                >
                  <Expand size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Expand</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Trash2 size={20} strokeWidth={1.5} />
                    </DialogTrigger>
                    <ConfirmDialog name="beneficiary" />
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Delete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Label>{data.name}</Label>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Group Name</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TabsList>
            <TabsTrigger value="detail">Details </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="detail">
          <GroupDetailTable table={table} />
        </TabsContent>
      </Tabs>
    </>
  );
}
