import {
  Table ,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import {  flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import useSmsLogsTableColumns from './useSmsLogsTableColumns';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';


import { useGetVoiceLogs, usePagination } from '@rahat-ui/query';

import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { CustomPagination, NoResult, SearchInput, SpinnerLoader } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';



export default function SmsLogsTable() {
 const {id:projectId} = useParams();
 const {
   pagination,
   filters,
   setNextPage,
   setPrevPage,
   setPerPage,
   selectedListItems,
   setSelectedListItems,
   setFilters,
   setPagination,
 } = usePagination();
const columns = useSmsLogsTableColumns();

  
     const searchParams = useSearchParams()
     const tab = searchParams.get('subTab') 
     const {voiceLogs, isLoading, voiceLogMeta}= useGetVoiceLogs(projectId as UUID,tab as string,{ ...pagination, filters});
     
     const handleFilterChange = (event: any) => {
      if (event && event.target) {
        const { name, value } = event.target;
        const filterValue = value === 'ALL' ? '' : value;
        table.getColumn(name)?.setFilterValue(filterValue);
        setFilters({
          ...filters,
          [name]: filterValue,
        });
      }
      setPagination({
        ...pagination,
        page: 1,
      });
    };
  

  const table = useReactTable({
  manualPagination: true,
    data: voiceLogs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
 <>
  <div className="flex justify-between gap-2">
         <SearchInput
                 name="title"
                 className="w-[100%]"
                 value={
                   (table.getColumn('communication_title')?.getFilterValue() as string) ??
                   filters?.title
                 }
                 onSearch={(event) => handleFilterChange(event)}
                
                
                />
        
         <SearchInput
                 name="group"
                 className="w-[100%]"
                 value={
                   (table.getColumn('groupName')?.getFilterValue() as string) ??
                   filters?.group
                 }
                 onSearch={(event) => handleFilterChange(event)}
                
                
                />
                 <SelectComponent
                          name="type"
                          options={['BENEFICIARY', 'STAKEHOLDER']}
                          onChange={(value) =>
                            handleFilterChange({
                              target: { name: 'group_type', value },
                            })
                          }
                          value={filters?.type || ''}
                        />
                        <SelectComponent
                          name="status"
                          options={['Work in Progress', 'COMPLETED', 'Failed', 'Not Started', 'PENDING']}
                          onChange={(value) =>
                            handleFilterChange({
                              target: { name: 'status', value },
                            })
                          }
                          value={filters?.status || ''}
                        />



       </div>
 
 <div className=" bg-card border rounded mt-4">
    <ScrollArea className="h-[calc(100vh-320px)]">
      <Table>
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
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {isLoading ? <SpinnerLoader /> : <NoResult />}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>

          <CustomPagination
         meta={voiceLogMeta || {
          total: 0,
          currentPage: 0,
          lastPage: 0,
          perPage: 0,
          next: null,
          prev: null,
          
          
          
                    }} 
                    handleNextPage={setNextPage}
                    handlePrevPage={setPrevPage}
                  
                    handlePageSizeChange={setPerPage}
                    setPagination={setPagination}
                    
                    currentPage={pagination.page}
                    perPage={pagination.perPage}
                    total = {voiceLogMeta?.lastPage || 0}
        />
    
    {/* <ClientSidePagination table={table} /> */}
  </div>
 
 
 
 </>
  );
}
