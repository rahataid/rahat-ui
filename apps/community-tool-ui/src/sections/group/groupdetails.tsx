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
import { Download, Minus, MoreVertical, Trash2 } from 'lucide-react';

import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import {
  useCommunityGroupListByID,
  useCommunityGroupPurge,
  useCommunityGroupRemove,
  useCommunityGroupedBeneficiariesDownload,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import CustomPagination from '../../components/customPagination';
import GroupDetailTable from './group.table';
import { useCommunityGroupDeailsColumns } from './useGroupColumns';
import { useRouter } from 'next/navigation';

type IProps = {
  uuid: string;
  // closeSecondPanel: VoidFunction;
};

export default function GroupDetail({ uuid }: IProps) {
  const {
    pagination,
    selectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data: responseByUUID } = useCommunityGroupListByID(uuid, pagination);
  const columns = useCommunityGroupDeailsColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const download = useCommunityGroupedBeneficiariesDownload();
  const removeCommunityGroup = useCommunityGroupRemove();
  const purgeCommunityGroup = useCommunityGroupPurge();
  const router = useRouter();
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
      rowSelection: selectedListItems,
    },
  });

  const handleClick = async () => {
    const response = await download.mutateAsync({
      uuid: uuid,
      config: { responseType: 'arraybuffer' },
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(response?.data?.data);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'beneficiaries.xlsx');

    // const blob = new Blob([response.data], {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // });

    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'beneficiaries.xlsx';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(url);
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
          uuid: uuid,
          deleteBeneficiaryFlag: false,
        });
        router.push('/group');
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
          uuid: uuid,
          deleteBeneficiaryFlag: true,
        });
        router.push('/group');

        // closeSecondPanel();
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
        await purgeCommunityGroup.mutateAsync(uuid);
        // closeSecondPanel();
        router.push('/group');
      }
    });
  };
  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4 pb-1">
          <div className="flex gap-4">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Label>{responseByUUID?.data?.name}</Label>
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
        </TabsContent>

        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          meta={responseByUUID?.response?.meta || { total: 0, currentPage: 0 }}
          perPage={pagination?.perPage}
          total={responseByUUID?.response?.meta?.total || 0}
        />
      </Tabs>
    </>
  );
}
