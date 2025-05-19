'use client';
import { Table, flexRender } from '@tanstack/react-table';
import { CircleEllipsisIcon, X } from 'lucide-react';

import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PinIcon } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';

type CommunityGroup = {
  name: string;
  uuid: string;
};
type IProps = {
  handleSaveTargetResults: (label: string) => void;
  table: Table<ListBeneficiary>;
  loading: boolean;
  targetUUID: string;
  communityGroup: CommunityGroup[];
};

export default function ListView({
  handleSaveTargetResults,
  table,
  loading,
  targetUUID,
  communityGroup,
}: IProps) {
  const [label, setLabel] = useState<string>('');
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="w-full mt-1 p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Button
            className="rounded ml-auto"
            name="location"
            type="button"
            onClick={() => setOpen(true)}
            disabled={!targetUUID}
          >
            <PinIcon className="h-6 w-6 mr-2" />
            Add to group
          </Button>
        </div>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="w-full">
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex justify-between items-center pb-1 gap-4">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Label className="text-lg font-medium">
                          Assign beneficiary to the group
                          {/* {communityGroup?.filter((item) =>
                            item.name.includes(label),
                          ).length > 0
                            ? 'Assign beneficiary to the group'
                            : 'Add new Group to save the result'} */}
                        </Label>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => {
                          setOpen(false);
                          setLabel('');
                        }}
                      >
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
                <Command className="h-52">
                  <CommandInput
                    placeholder={'Search Group...'}
                    autoFocus={true}
                    value={label}
                    onInput={(e) => setLabel(e.currentTarget.value)}
                  />
                  <CommandList className="no-scrollbar">
                    <CommandGroup>
                      {communityGroup?.map((item) => (
                        <CommandItem
                          key={item.uuid}
                          value={item.name}
                          onSelect={() => setLabel(item.name)}
                        >
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => handleSaveTargetResults(label as string)}
                disabled={label === ''}
              >
                Assign
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="rounded border bg-card">
          <ScrollArea className="h-[calc(100vh-190px)]">
            <TableComponent>
              <TableHeader className="bg-card sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      <div style={{ marginLeft: '48%' }}>
                        <CircleEllipsisIcon className="animate-spin h-8 w-8" />
                      </div>
                      Searching data...
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {table.getRowModel().rows?.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={table.getAllColumns().length}
                        className="h-24 text-center text-md"
                      >
                        No results found. Select filter options to list
                        targeting beneficiaries.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </TableComponent>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
