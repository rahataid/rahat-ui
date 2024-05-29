'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useProjectAction } from '@rahat-ui/query';
import { MS_ACTIONS } from '@rahataid/sdk';
import page from 'apps/rahat-ui/src/app/projects/c2c/[id]/beneficiary/page';
import { useReactTable } from '@tanstack/react-table';

const VendorList = () => {
  const uuid = useParams().id;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(5);

  const getVendors = useProjectAction();

  const fetchVendors = async () => {
    const result = await getVendors.mutateAsync({
      uuid,
      data: {
        action: MS_ACTIONS.VENDOR.LIST_BY_PROJECT,
        payload: {
          page: currentPage,
          perPage,
        },
      },
    });
    console.log({ result });
  };

  React.useEffect(() => {
    fetchVendors();
  }, []);

  //   console.log(fetchVendors);

  return (
    <div className="w-full h-full p-2 bg-secondary">
      {/* <div className="flex items-center mb-2">
        <Input
          placeholder="Filter Vendors..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div> */}
      <h1>Vendors List</h1>
    </div>
  );
};

export default VendorList;
