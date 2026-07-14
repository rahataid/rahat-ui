import { useCommunityGroupList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { cn } from '@rahat-ui/shadcn/src';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  humanizeString,
  truncatedText,
} from 'apps/community-tool-ui/src/utils';
import {
  ArrowBigLeft,
  ArrowBigUp,
  Check,
  ChevronsUpDown,
  CloudDownloadIcon,
} from 'lucide-react';
import { useState } from 'react';

interface IProps {
  data: any;
  handleRetargetClick: any;
  handleImportWithGroup: (groupName: string | null) => void;
  invalidFields: any;
  handleExportInvalidClick: any;
  hasUUID: boolean;
  loading: boolean;
}

export default function AddToQueue({
  data,
  handleRetargetClick,
  handleImportWithGroup,
  invalidFields,
  handleExportInvalidClick,
  hasUUID,
  loading,
}: IProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [useExistingGroup, setUseExistingGroup] = useState(false);
  const [selectGroupName, setSelectedGroupName] = useState<string | null>(null);
  const [groupPopoverOpen, setGroupPopoverOpen] = useState(false);

  const { pagination, filters } = usePagination();
  pagination.perPage = 50;
  pagination.page = 1;
  const { data: groupData } = useCommunityGroupList({
    ...pagination,
    ...filters,
  });

  const mappedData =
    data.length > 0
      ? data.map((d: any) => {
          const { rawData, ...rest } = d;
          return rest;
        })
      : [];

  const headerKeys = mappedData.length > 0 ? Object.keys(mappedData[0]) : [];

  function renderItemKey(item: any, key: string) {
    if (key === 'isDuplicate') {
      return '';
    }

    if (typeof item[key] === 'boolean') {
      return item[key] ? 'Yes' : 'No';
    }

    return item[key];
  }

  const hasDuplicates = data.some((item: any) => item.isDuplicate);

  const enableDisableImportButton = () => {
    if (hasUUID) return false;
    if (invalidFields.length || hasDuplicates) return true;
    if (loading) return true;
    return false;
  };

  const handleOpenDialog = () => {
    setUseExistingGroup(false);
    setSelectedGroupName(null);
    setDialogOpen(true);
  };

  const handleDialogImport = () => {
    setDialogOpen(false);
    handleImportWithGroup(useExistingGroup ? selectGroupName : null);
  };
  const isImportNowDisabled = useExistingGroup && !selectGroupName;

  const selectedGroupName = selectGroupName
    ? groupData?.data?.rows?.find((g: any) => g.name === selectGroupName)?.name
    : null;

  return (
    <div className="relative mt-5">
      <div className="flex mb-5 justify-between m-2">
        <Button
          onClick={handleRetargetClick}
          className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          <ArrowBigLeft size={18} strokeWidth={2} /> Back
        </Button>

        <div>
          <Button
            disabled={!invalidFields.length && !hasDuplicates}
            onClick={handleExportInvalidClick}
            className="w-40 mr-2 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            <ArrowBigUp size={18} strokeWidth={2} /> Export Invalid
          </Button>

          <Button
            disabled={enableDisableImportButton()}
            onClick={handleOpenDialog}
            className="w-40 bg-primary hover:ring-2 ring-primary py-2 px-4"
          >
            <CloudDownloadIcon size={18} strokeWidth={2} />
            &nbsp; Import Valid
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Import Beneficiaries</DialogTitle>
            <DialogDescription>
              Where do you want to import these beneficiaries?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div
              className={cn(
                'flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors',
                useExistingGroup
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200',
              )}
              onClick={() => setUseExistingGroup(true)}
            >
              <div
                className={cn(
                  'mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0',
                  useExistingGroup
                    ? 'border-primary bg-primary'
                    : 'border-gray-400',
                )}
              />
              <div className="flex-1 space-y-2">
                <p className="font-medium text-sm">
                  Import into an existing group
                </p>
                {useExistingGroup && (
                  <Popover
                    open={groupPopoverOpen}
                    onOpenChange={setGroupPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        role="combobox"
                        className="w-full justify-between font-normal text-muted-foreground hover:text-muted-foreground bg-white hover:bg-white border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {selectedGroupName ?? 'Select group'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 h-[200px]">
                      <Command>
                        <CommandInput placeholder="Search group..." />
                        <CommandList>
                          <CommandEmpty>No group found.</CommandEmpty>
                          <CommandGroup>
                            {groupData?.data?.rows?.map((item: any) => (
                              <CommandItem
                                key={item.uuid}
                                value={item.name}
                                onSelect={() => {
                                  setSelectedGroupName(item.name);
                                  setGroupPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    item.name === selectGroupName
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {item.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>

            <div
              className={cn(
                'flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors',
                !useExistingGroup
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200',
              )}
              onClick={() => setUseExistingGroup(false)}
            >
              <div
                className={cn(
                  'mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0',
                  !useExistingGroup
                    ? 'border-primary bg-primary'
                    : 'border-gray-400',
                )}
              />
              <div>
                <p className="font-medium text-sm">Proceed without a group</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A group will be auto-created by the system
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={isImportNowDisabled}
              onClick={handleDialogImport}
              className="bg-primary hover:ring-2 ring-primary"
            >
              Import Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <hr />

      <div className="table-wrp block h-screen import-container overflow-x-auto">
        <table className="ml-2 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="bg-white border-b sticky top-0">
            <tr>
              {headerKeys.map((key) => (
                <th style={{ minWidth: 150 }} className="px-2 py-1" key={key}>
                  {invalidFields.find(
                    (field: any) => field.fieldName === key,
                  ) ? (
                    <span className="text-red-500">
                      {truncatedText(humanizeString(key), 40)}*
                    </span>
                  ) : key === 'isDuplicate' ? (
                    ''
                  ) : (
                    truncatedText(humanizeString(key), 40)
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="h-screen overflow-y-auto">
            {data.map((item: any, index: number) => (
              <tr
                key={index}
                className={`${
                  item.isDuplicate
                    ? 'bg-orange-100 border-b'
                    : 'odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                }`}
              >
                {headerKeys.map((key) => {
                  const errorData = invalidFields.find(
                    (err: any) =>
                      err.uuid === item['uuid'] &&
                      err.value === item[key] &&
                      key === err.fieldName,
                  );

                  const isInvalid = !!errorData;

                  const cellContent = renderItemKey(item, key);

                  // DUPLICATE + INVALID
                  if (item.isDuplicate && isInvalid) {
                    return (
                      <td className="px-4 py-1.5 bg-red-100" key={key}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full h-full cursor-pointer">
                                {cellContent}
                              </div>
                            </TooltipTrigger>

                            <TooltipContent align="start">
                              <div className="space-y-1">
                                <p>This row is duplicate!</p>
                                <p>{errorData?.message}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  }

                  // INVALID STATUS
                  if (isInvalid) {
                    return (
                      <td className="px-4 py-1.5 bg-red-100" key={key}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full h-full cursor-pointer">
                                {cellContent}
                              </div>
                            </TooltipTrigger>

                            <TooltipContent align="start">
                              <p>{errorData?.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  }

                  // DUPLICATE ROW
                  if (item.isDuplicate) {
                    return (
                      <td className="px-4 py-1.5" key={key}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full h-full cursor-pointer">
                                {cellContent}
                              </div>
                            </TooltipTrigger>

                            <TooltipContent align="start">
                              <p>This row is duplicate!</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  }

                  // NORMAL CELL
                  return (
                    <td className="px-4 py-1.5" key={key}>
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
