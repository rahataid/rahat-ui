'use client';
import { Table, flexRender } from '@tanstack/react-table';
import { CircleEllipsisIcon, Settings2, RefreshCw } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import {
  useCommunitySettingList,
  useUploadStandardJson,
} from '@rahat-ui/community-query';

type IProps = {
  // handleClick: (item: FieldDefinition) => void;
  table: Table<FieldDefinition>;
  setFilters: (fiters: Record<string, any>) => void;
  filters: Record<string, any>;
  loading: boolean;
};

export default function ListView({
  table,
  setFilters,
  filters,
  loading,
}: IProps) {
  const { isLoading, data } = useCommunitySettingList({ page: 1, perPage: 20 });

  const aiSetting = data?.data.find(
    (setting: any) => setting.name === 'AI_API_URL',
  );
  const aiBaseurl = aiSetting?.value?.URL;
  const aiStandardName = aiSetting?.value?.standard_name;
  const aiStandardVersion = aiSetting?.value?.version;
  const uploadStandardFields = useUploadStandardJson();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [syncing, setSyncing] = React.useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setSyncing(true);
      try {
        await uploadStandardFields.mutateAsync({
          payload: {
            file,
            standard_name: 'community_data_standard',
            version: '',
            description: 'Uploaded by user',
          },
          baseURL: aiBaseurl,
        });
      } finally {
        setSyncing(false);
      }
    }
  };
  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      table.getColumn(name)?.setFilterValue(value);
      setFilters({
        ...filters,
        [name]: value.replace(/\s+/g, '_'),
      });
    }
  };
  return (
    <>
      <div className="w-full -mt-2 p-2 bg-secondary">
        <div className="flex items-center mb-2 mt-2">
          <Input
            placeholder="Filter field definitions..."
            name="name"
            value={
              (table.getColumn('name')?.getFilterValue() as string) ??
              filters?.name
            }
            onChange={(event) => handleFilterChange(event)}
            className="rounded mr-2"
          />
          <Button
            variant="outline"
            className="mr-2 flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={syncing}
          >
            <RefreshCw
              className={syncing ? 'animate-spin h-4 w-4' : 'h-4 w-4'}
            />
            {syncing ? 'Syncing' : 'Sync'}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings2 className="mr-2 h-4 w-5" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              <TableBody>
                {table.getRowModel().rows?.length ? (
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
                      className="h-24 text-center"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center mt-4">
                          <div className="text-center">
                            <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />
                            <Label className="text-base">Loading ...</Label>
                          </div>
                        </div>
                      ) : (
                        'No result found'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableComponent>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
