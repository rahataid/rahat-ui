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
import { Minus } from 'lucide-react';

import { ListGroup } from '@rahataid/community-tool-sdk/groups';
import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';

import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import GroupDetailTable from './group.table';
import { useCommunityGroupListByID } from '@rahat-ui/community-query';
import { useCommunityGroupDeailsColumns } from './useGroupColumns';
type IProps = {
  data: ListGroup;
  handleClose: VoidFunction;
};

export default function GroupDetail({ data, handleClose }: IProps) {
  const { data: responseByUUID } = useCommunityGroupListByID(data?.uuid);
  const columns = useCommunityGroupDeailsColumns();
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
          <p className="text-xs font-medium text-right mr-5 mt-5">
            Total beneficiary Count :
            {responseByUUID?.data?.beneficiariesGroup.length}
          </p>
        </TabsContent>
      </Tabs>
    </>
  );
}
