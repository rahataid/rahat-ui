import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Delete,
  Download,
  MoreVertical,
  Send,
  Share,
  Trash2,
  X,
} from 'lucide-react';

import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import {
  useActiveFieldDefList,
  useBulkGenerateVerificationLink,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { GroupPurge } from '@rahataid/community-tool-sdk';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import CustomPagination from '../../components/customPagination';
import { SETTINGS_NAME } from '../../constants/settings.const';
import { deHumanizeString, simpleString } from '../../utils';
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
  const { data: listFieldDef } = useActiveFieldDefList({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const download = useCommunityGroupedBeneficiariesDownload();
  const removeCommunityGroup = useCommunityGroupRemove();
  const purgeCommunityGroup = usePurgeGroupedBeneficiary();
  const { data: settingsData } = useCommunitySettingList({
    page: 1,
    perPage: 300,
  });
  const exportPinnedListBeneficiary = useExportPinnedListBeneficiary();
  const bulkGenereateLink = useBulkGenerateVerificationLink();
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

  const [labels, setLabels] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: any) => {
    const filtered = labels.filter((s) => s !== item);
    setLabels(filtered);
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
    const filteredValue: any =
      settingsData &&
      settingsData?.data?.find(
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

  const handleSelectChange = (item) => {
    if (item === 'Select All') {
      const rdata = listFieldDef?.data?.map((item: any) =>
        simpleString(item.name),
      );
      setLabels(rdata);
      return;
    }
    const merged = [...labels, simpleString(item)];
    setLabels(merged);
  };

  const selectables =
    listFieldDef?.data?.filter(
      (item: any) => !labels.includes(simpleString(item.name)),
    ) || [];

  const sortedSelectables = [
    { uuid: 'select-all', name: 'Select All' },
    ...selectables.sort((a, b) => {
      const isANumber = /^\d/.test(a.name);
      const isBNumber = /^\d/.test(b.name);

      if (isANumber && !isBNumber) return -1;
      if (!isANumber && isBNumber) return 1;

      return a.name.localeCompare(b.name);
    }),
  ];
  const handleDownload = async () => {
    const response = await download.mutateAsync({
      uuid: uuid,
      config: { responseType: 'arraybuffer' },
    });

    const rawData = response?.data?.data;

    const filteredData = rawData.map((item: Record<string, any>) => {
      const filteredItem: Record<string, any> = {};
      labels.forEach((key) => {
        const dehumanizedString = deHumanizeString(key as string);

        if (item.hasOwnProperty(dehumanizedString)) {
          filteredItem[dehumanizedString] = item[dehumanizedString];
        }
      });
      return filteredItem;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'beneficiaries.xlsx');
    setLabels([]);
  };

  const handleVerificationLink = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: ' Send Verification Link',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Yes, I am sure!',
      denyButtonText: 'No, cancel it!',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await bulkGenereateLink.mutateAsync(uuid as string);
      } else if (result.isDenied) {
        Swal.fire(
          'Cancelled',
          `Generating Verification Link Canceled`,
          'error',
        );
      }
    });
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
                  <Share className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  disabled={
                    responseByUUID?.data?.beneficiariesGroup.length === 0
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={removeBeneficiaryFromGroup}
                  disabled={
                    responseByUUID?.data?.beneficiariesGroup.length === 0
                  }
                >
                  <Delete className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleVerificationLink}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handlePurge}
                  disabled={
                    responseByUUID?.data?.beneficiariesGroup.length === 0
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent className="w-full">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <div className="flex justify-between items-center pb-1 gap-4">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Label className="text-lg font-medium">
                              Select fields to download
                            </Label>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger onClick={() => setOpen(false)}>
                            <X
                              className="text-muted-foreground hover:text-foreground text-red-700"
                              size={23}
                              strokeWidth={1.9}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Close</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <ScrollArea
                      className={`${
                        labels.length < 10 ? 'h-32' : 'h-52'
                      } w-[95%] border m-2 pt-1 pb-1 text-sm rounded-md shadow-lg cursor-pointer bg-white`}
                      hidden={labels.length === 0}
                    >
                      {labels.map((item) => {
                        return (
                          <Badge key={item} variant="secondary" className="m-1">
                            {item}
                            <button
                              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUnselect(item);
                                }
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onClick={() => handleUnselect(item)}
                            >
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </Badge>
                        );
                      })}

                      {labels.length === 0 && (
                        <h1 className="text-center ">No fields selected</h1>
                      )}
                    </ScrollArea>

                    <Command className="h-52">
                      <CommandInput
                        placeholder={'Search field...'}
                        autoFocus={true}
                      />
                      <CommandList className="no-scrollbar">
                        <CommandEmpty>No field found.</CommandEmpty>
                        <CommandGroup>
                          {sortedSelectables?.map((item) => (
                            <CommandItem
                              key={item.uuid}
                              value={item.name}
                              onSelect={() => handleSelectChange(item.name)}
                            >
                              {simpleString(item.name)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setLabels([])}
                    disabled={labels.length === 0}
                  >
                    Clear All
                  </Button>
                  <AlertDialogAction
                    onClick={handleDownload}
                    disabled={labels.length === 0}
                  >
                    Download
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
