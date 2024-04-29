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
import { Download, Minus, Trash2, MoreVertical } from 'lucide-react';

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
import {
  useCommunityGroupListByID,
  useCommunityGroupPurge,
  useCommunityGroupedBeneficiariesDownload,
} from '@rahat-ui/community-query';
import { useCommunityGroupDeailsColumns } from './useGroupColumns';
import Swal from 'sweetalert2';
import { useCommunityGroupRemove } from '@rahat-ui/community-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';

type IProps = {
  data: ListGroup;
  closeSecondPanel: VoidFunction;
};

export default function GroupDetail({ data, closeSecondPanel }: IProps) {
  const { data: responseByUUID } = useCommunityGroupListByID(data?.uuid);
  const columns = useCommunityGroupDeailsColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const download = useCommunityGroupedBeneficiariesDownload();
  const removeCommunityGroup = useCommunityGroupRemove();
  const purgeCommunityGroup = useCommunityGroupPurge();

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

  const handleClick = async () => {
    const k = responseByUUID?.data?.beneficiariesGroup?.map((item) => {
      const groupName = data?.name;
      return { ...item.beneficiary, groupName };
    });
    const response = await download.mutateAsync({
      groupedBeneficiaries: k,
      config: { responseType: 'arraybuffer' },
    });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beneficiaries.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const removeBeneficiaryFromGroup = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Remove beneficiary from this group',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Yes, I am sure!',
      denyButtonText: 'No, cancel it!',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-1',
        denyButton: 'order-2',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await removeCommunityGroup.mutateAsync({
          uuid: data?.uuid,
          deleteBeneficiaryFlag: false,
        });
        closeSecondPanel();
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Beneficiary will be removed from group and archived!',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Yes, I am sure!',
      denyButtonText: 'No, cancel it!',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-1',
        denyButton: 'order-2',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await removeCommunityGroup.mutateAsync({
          uuid: data?.uuid,
          deleteBeneficiaryFlag: true,
        });
        closeSecondPanel();
      }
    });
  };

  const handlePurge = () => {
    Swal.fire({
      title: 'CAUTION!',
      text: 'Group and beneficiaries will be deleted permanently!',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Yes, I am sure!',
      denyButtonText: 'No, cancel it!',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-1',
        denyButton: 'order-2',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await purgeCommunityGroup.mutateAsync(data?.uuid);
        closeSecondPanel();
      }
    });
  };

  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger onClick={closeSecondPanel}>
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

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild onClick={handleClick}>
                  <Download
                    className="cursor-pointer"
                    size={18}
                    strokeWidth={1.6}
                    color="#007bb6"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TabsList>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild onClick={removeBeneficiaryFromGroup}>
                  <Trash2
                    className="cursor-pointer mr-3"
                    size={20}
                    strokeWidth={1.6}
                    color="#FF0000"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove from Group</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TabsTrigger value="detail" className="mr-2">
              Details{' '}
            </TabsTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical
                  className="cursor-pointer"
                  size={20}
                  strokeWidth={1.5}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDelete}>
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePurge}>Purge</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
