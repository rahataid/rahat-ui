import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { MoreVertical, Trash2 } from 'lucide-react';

import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import {
  useCommunityGroupListByID,
  useCommunityGroupRemove,
  useCommunityGroupStore,
  useCommunityGroupedBeneficiariesDownload,
  useCommunitySettingList,
  useExportPinnedListBeneficiary,
  usePurgeGroupedBeneficiary,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { GroupPurge } from '@rahataid/community-tool-sdk';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import CustomPagination from '../../components/customPagination';
import { SETTINGS_NAME } from '../../constants/settings.const';
import GroupDetailTable from './group.table';
import { useCommunityGroupDeailsColumns } from './useGroupColumns';

type IProps = {
  uuid: string;
  // closeSecondPanel: VoidFunction;
};

export default function GroupDetail({ uuid }: IProps) {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    resetSelectedListItems,
  } = usePagination();
  const { data: responseByUUID } = useCommunityGroupListByID(uuid, pagination);
  const columns = useCommunityGroupDeailsColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const download = useCommunityGroupedBeneficiariesDownload();
  const removeCommunityGroup = useCommunityGroupRemove();
  const purgeCommunityGroup = usePurgeGroupedBeneficiary();
  const { data: settingsData } = useCommunitySettingList();
  const exportPinnedListBeneficiary = useExportPinnedListBeneficiary();

  const {
    deleteSelectedBeneficiariesFromImport,
    setDeleteSelectedBeneficiariesFromImport,
    resetDeletedSelectedBeneficiaries,
  } = useCommunityGroupStore();
  const router = useRouter();
  const table = useReactTable({
    manualPagination: true,
    data: responseByUUID?.data?.beneficiariesGroup || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.beneficiary.uuid as string,
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
  };

  const removeBeneficiaryFromGroup = () => {
    if (deleteSelectedBeneficiariesFromImport.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Disconnect beneficiary from ${responseByUUID?.data?.name} `,
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: 'No, cancel it!',
        customClass: {
          actions: 'my-actions',
          confirmButton: 'order-1',
          denyButton: 'order-2',
        },
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const data = {
            uuid: uuid,
            deleteBeneficiaryFlag: false,
            beneficiaryUuid: deleteSelectedBeneficiariesFromImport,
          };
          await removeCommunityGroup.mutateAsync(data);
          router.push('/group');
        }
      });
    } else {
      Swal.fire('Please select beneficiary to  disconnect', '', 'warning');
    }
  };

  // const handleDelete = () => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Beneficiary will be removed from group and archived!',
  //     icon: 'question',
  //     showDenyButton: true,
  //     confirmButtonText: 'Yes, I am sure!',
  //     denyButtonText: 'No, cancel it!',
  //     customClass: {
  //       actions: 'my-actions',
  //       confirmButton: 'order-1',
  //       denyButton: 'order-2',
  //     },
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       await removeCommunityGroup.mutateAsync({
  //         uuid: uuid,
  //         deleteBeneficiaryFlag: true,
  //       });
  //       router.push('/group');

  //       // closeSecondPanel();
  //     }
  //   });
  // };

  const handlePurge = async () => {
    const data = {
      groupUuid: uuid,
      beneficiaryUuid: deleteSelectedBeneficiariesFromImport,
    };
    if (deleteSelectedBeneficiariesFromImport.length > 0) {
      await purgeCommunityGroup.mutateAsync(data as GroupPurge);
      return resetDeletedSelectedBeneficiaries();
      // return router.push('/group/import-logs');
    }

    Swal.fire('Please select beneficiary to delete', '', 'warning');
  };

  const handleExportPinnedBeneficiary = () => {
    const filteredValue: any = settingsData?.data?.find(
      (item: any) => item.name === SETTINGS_NAME.EXTERNAL_APPS,
    )?.value;

    const obj = filteredValue
      ? Object.entries(filteredValue).reduce((acc, [key, value]) => {
          acc[value] = key;
          return acc;
        }, {} as { [key: string]: string })
      : {};
    const payload = {
      groupUUID: uuid as string,
      config: obj,
    };
    exportPinnedListBeneficiary.mutate(payload);
  };

  useEffect(() => {
    setDeleteSelectedBeneficiariesFromImport(
      Object.keys(selectedListItems).filter((key) => selectedListItems[key]),
    );
  }, [selectedListItems, setDeleteSelectedBeneficiariesFromImport]);

  useEffect(() => {
    if (deleteSelectedBeneficiariesFromImport.length === 0) {
      resetSelectedListItems();
    }
  }, [deleteSelectedBeneficiariesFromImport.length, resetSelectedListItems]);

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
          </div>

          <div className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={removeBeneficiaryFromGroup}
                  disabled={
                    responseByUUID?.data?.beneficiariesGroup.length === 0
                  }
                >
                  <Trash2
                    className="cursor-pointer mr-3"
                    size={20}
                    strokeWidth={1.6}
                    color={`${
                      responseByUUID?.data?.beneficiariesGroup.length === 0
                        ? 'grey'
                        : 'red'
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disconnect beneficiaries from Group</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical
                  className="cursor-pointer"
                  size={20}
                  strokeWidth={1.5}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={handleExportPinnedBeneficiary}
                  disabled={
                    responseByUUID?.data?.beneficiariesGroup.length === 0
                  }
                >
                  Export Beneficiaries
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handlePurge}
                  disabled={
                    responseByUUID?.data?.beneficiariesGroup.length === 0
                  }
                >
                  Delete Beneficiary
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleClick}
                  disabled={
                    responseByUUID?.data?.beneficiariesGroup.length === 0
                  }
                >
                  Download Beneficiary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
