'use client';
import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import { useCambodiaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import ViewColumns from '../../components/view.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudUpload, PlusIcon, UserRoundX } from 'lucide-react';
import Link from 'next/link';

export default function BeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      table.getColumn(name)?.setFilterValue(value);
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };
  const columns = useCambodiaBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: [
      {
        uuid: 'a1b2c3d4-e5f6-7890-ab12-cdef34567890',
        name: 'John Doe',
        type: 'Sale',
        phone: '123-456-7890',
        gender: 'Male',
      },
      {
        uuid: 'b1c2d3e4-f5a6-7890-ab12-cdef45678901',
        name: 'Jane Smith',
        type: 'Lead',
        phone: '987-654-3210',
        gender: 'Female',
      },
      {
        uuid: 'c1d2e3f4-a5b6-7890-ab12-cdef56789012',
        name: 'Bob Johnson',
        type: 'Sale',
        phone: '555-123-4567',
        gender: 'Male',
      },
      {
        uuid: 'd1e2f3a4-b5c6-7890-ab12-cdef67890123',
        name: 'Alice Brown',
        type: 'Lead',
        phone: '444-987-6543',
        gender: 'Female',
      },
      {
        uuid: 'e1f2a3b4-c5d6-7890-ab12-cdef78901234',
        name: 'Chris Lee',
        type: 'Sale',
        phone: '222-333-4444',
        gender: 'Non-binary',
      },
      {
        uuid: 'f1a2b3c4-d5e6-7890-ab12-cdef89012345',
        name: 'Emily Clark',
        type: 'Lead',
        phone: '333-444-5555',
        gender: 'Female',
      },
      {
        uuid: 'a2b3c4d5-e6f7-7890-ab12-cdef90123456',
        name: 'Michael Scott',
        type: 'Sale',
        phone: '777-888-9999',
        gender: 'Male',
      },
      {
        uuid: 'b2c3d4e5-f6a7-7890-ab12-cdef01234567',
        name: 'Sara Connor',
        type: 'Lead',
        phone: '888-999-1111',
        gender: 'Female',
      },
      {
        uuid: 'c2d3e4f5-a6b7-7890-ab12-cdef12345678',
        name: 'David Tennant',
        type: 'Sale',
        phone: '666-777-8888',
        gender: 'Male',
      },
      {
        uuid: 'd2e3f4a5-b6c7-7890-ab12-cdef23456789',
        name: 'Olivia Benson',
        type: 'Lead',
        phone: '999-888-7777',
        gender: 'Female',
      },
      {
        uuid: 'e2f3a4b5-c6d7-7890-ab12-cdef34567890',
        name: 'Liam Neeson',
        type: 'Sale',
        phone: '111-222-3333',
        gender: 'Male',
      },
      {
        uuid: 'f2a3b4c5-d6e7-7890-ab12-cdef45678901',
        name: 'Emma Watson',
        type: 'Lead',
        phone: '444-555-6666',
        gender: 'Female',
      },
      {
        uuid: 'a3b4c5d6-e7f8-7890-ab12-cdef56789012',
        name: 'Jake Peralta',
        type: 'Sale',
        phone: '222-333-4444',
        gender: 'Male',
      },
      {
        uuid: 'b3c4d5e6-f7a8-7890-ab12-cdef67890123',
        name: 'Amy Santiago',
        type: 'Lead',
        phone: '555-666-7777',
        gender: 'Female',
      },
      {
        uuid: 'c3d4e5f6-a7b8-7890-ab12-cdef78901234',
        name: 'Terry Jeffords',
        type: 'Sale',
        phone: '888-111-2222',
        gender: 'Male',
      },
    ],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <>
      <div className="p-4 bg-white ">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-semibold text-2xl mb-">Benificiaries</h1>
            <p className="text-muted-foreground">
              Track all the beneficiaries here.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/projects/el-cambodia/${id}/beneficiary/discardedbenificary`}
            >
              <Button variant="outline">
                <UserRoundX className="mr-2 h-4 w-4" /> Discarded Beneficiaries
              </Button>
            </Link>
            <Button variant="outline">
              <CloudUpload className="mr-2 h-4 w-4" /> Upload Beneficiaries
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 ">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              name="name"
              className="w-[100%]"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ??
                filters?.name
              }
              onSearch={(event) => handleFilterChange(event)}
            />
            <SelectComponent name="Type" options={['Sale', 'Lead']} />
            <Button>
              <PlusIcon />
              Add Beneficiary
            </Button>
            {/* <ViewColumns table={table} /> */}
          </div>
          <CambodiaTable table={table} />
        </div>
      </div>
      {/* <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={(data?.response?.meta as any) || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={data?.response?.meta?.total || 0}
      /> */}
    </>
  );
}
