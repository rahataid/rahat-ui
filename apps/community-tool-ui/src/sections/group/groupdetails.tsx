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
import { Download, Minus, Trash2 } from 'lucide-react';

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
  useCommunityGroupedBeneficiariesDownload,
} from '@rahat-ui/community-query';
import { useCommunityGroupDeailsColumns } from './useGroupColumns';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useCommunityGroupRemove } from '@rahat-ui/community-query';

type IProps = {
  data: ListGroup;
  handleClose: VoidFunction;
};

export default function GroupDetail({ data, handleClose }: IProps) {
  const { data: responseByUUID } = useCommunityGroupListByID(data?.uuid);
  const columns = useCommunityGroupDeailsColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const download = useCommunityGroupedBeneficiariesDownload();
  const removeCommunityGroup = useCommunityGroupRemove();

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

  const handleGroupDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Choose what you want to do with the beneficiaries:',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      denyButtonText: 'Permanently delete beneficiaries',
      confirmButtonText: 'Remove beneficiaries from the group',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await removeCommunityGroup.mutateAsync({
            uuid: data?.uuid,
            deleteBeneficiaryFlag: false,
          });
        } catch (error) {
          toast.error('Error deleting Group');
          console.error('Error deleting Group:', error);
        }
      } else if (result.isDenied) {
        try {
          await removeCommunityGroup.mutateAsync({
            uuid: data?.uuid,
            deleteBeneficiaryFlag: true,
          });
        } catch (error) {
          toast.error('Error deleting Group');
          console.error('Error deleting Group:', error);
        }
      } else {
        Swal.fire('Cancelled', `The Group wasn't deleted.`, 'error');
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
                <TooltipTrigger asChild onClick={handleGroupDelete}>
                  <Trash2
                    className="cursor-pointer mr-3"
                    size={20}
                    strokeWidth={1.6}
                    color="#FF0000"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Group</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
