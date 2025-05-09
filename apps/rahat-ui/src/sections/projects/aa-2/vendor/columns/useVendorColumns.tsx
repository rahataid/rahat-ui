import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IProjectVendor } from '../types';
import { useAAVendorsStore } from '@rahat-ui/query';

export const useProjectVendorTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const { vendors, setVendorDetails } = useAAVendorsStore((state) => ({
    vendors: state.vendors,
    setVendorDetails: state.setVendorDetails,
  }));
  const handleViewClick = (vendorId: string) => {
    vendors?.find((vendor) => {
      if (vendor.uuid === vendorId) {
        setVendorDetails(vendor);
      }
    });
    router.push(`/projects/aa/${id}/vendors/${vendorId}`);
  };
  const columns: ColumnDef<IProjectVendor>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => <div>{row.getValue('location') || 'N/A'}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() => handleViewClick(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
