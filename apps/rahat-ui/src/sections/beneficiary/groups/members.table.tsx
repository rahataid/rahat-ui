import * as React from 'react';
import BeneficiaryTable from '../../projects/aa/groups/beneficiary/details/table/beneficiary.table';
import SearchInput from '../../projects/components/search.input';
import ViewColumns from '../../projects/components/view.columns';
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
import AddButton from '../../projects/components/add.btn';

type IProps = {
  table: Table<any>;
  groupedBeneficiaries: [];
  groupUUID: string;
  name: string;
};

export default function MembersTable({
  table,
  groupedBeneficiaries,
  groupUUID,
  name,
}: IProps) {
  return (
    <>
      <div className="p-4 border rounded-md mt-5">
        <div className="flex justify-between gap-2">
          <SearchInput
            name="Beneficiaries"
            className="mb-2 w-full"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
          />
          <ViewColumns table={table} />
          {groupedBeneficiaries?.length ? (
            <AddButton
              variant="outline"
              className="border-primary text-primary"
              name="Beneficiary"
              path={`/beneficiaries/groups/${groupUUID}/select`}
            />
          ) : null}
        </div>
        <div className="bg-card border rounded">
          <ScrollArea className="h-[calc(100vh-496px)]">
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
                          No beneficiary added
                        </p>
                        <p className="text-muted-foreground text-base">
                          Add beneficiary to the group to display data
                        </p>
                        <AddButton
                          name="Beneficiary"
                          path={`/beneficiary/groups/${groupUUID}/select?member=true&name=${name}`}
                        />
                      </div>
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
