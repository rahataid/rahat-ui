import * as React from 'react';
import { Table, flexRender } from '@tanstack/react-table';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { FileWarning } from 'lucide-react';
import SearchInput from '../../components/search.input';
import ViewColumns from '../../components/view.columns';
import AddButton from '../../components/add.btn';
import { useParams } from 'next/navigation';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { useProjectStore } from '@rahat-ui/query';

type IProps = {
  table: Table<any>;
  groupedBeneficiaries: [];
  groupUUID: string;
  name: string;
  loading?: boolean;
};

export default function MembersTable({
  table,
  groupedBeneficiaries,
  groupUUID,
  name,
  loading,
}: IProps) {
  const { id } = useParams();
  const projectClosed = useProjectStore(
    (state) => state.singleProject?.projectClosed,
  );

  return (
    <>
      <div className="p-4 border rounded-md mt-5">
        <div className="flex justify-between gap-2">
          <SearchInput
            className="w-full mb-2"
            name="phone number"
            value={(table.getColumn('phone')?.getFilterValue() as string) ?? ''}
            onSearch={(event) =>
              table.getColumn('phone')?.setFilterValue(event.target.value)
            }
          />
          <ViewColumns table={table} />
          {groupedBeneficiaries?.length ? (
            <AddButton
              variant="outline"
              className="border-primary text-primary"
              name="Consumer"
              path={`/projects/el-kenya/${id}/beneficiary/group/${groupUUID}/select?name=${name}`}
              disabled={projectClosed}
            />
          ) : null}
        </div>
        <div className="bg-card border rounded">
          <ScrollArea className="h-[calc(100vh-465px)]">
            {loading ? (
              <TableLoader />
            ) : (
              <>
                <TableComponent>
                  <TableHeader className="sticky top-0 bg-card">
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
                          className="h-72 text-center "
                        >
                          <div className="grid place-items-center space-y-2">
                            <div className="bg-secondary rounded-full p-3 w-min">
                              <FileWarning size={18} strokeWidth={1.5} />
                            </div>
                            <p className="font-medium text-lg">
                              No consumer added
                            </p>
                            <p className="text-muted-foreground text-base">
                              Add consumer to the group to display data
                            </p>
                            <AddButton
                              name="Beneficiary"
                              path={`/projects/el-kenya/${id}/beneficiary/group/${groupUUID}/select?name=${name}`}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </TableComponent>
              </>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
