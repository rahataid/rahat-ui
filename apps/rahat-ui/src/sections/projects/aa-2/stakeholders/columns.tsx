'use client';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';

export const useProjectStakeholdersTableColumns = () => {
  const router = useRouter();
  const { id, stakeholderId } = useParams();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div> {row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone number',
      cell: ({ row }) => <div> {row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div> {row.getValue('email')}</div>,
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => <div> {row.getValue('designation')}</div>,
    },

    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => <div> {row.getValue('organization')}</div>,
    },
    {
      accessorKey: 'district',
      header: 'District',
      cell: ({ row }) => <div> {row.getValue('district')}</div>,
    },

    {
      accessorKey: 'municipality',
      header: 'Municipality',
      cell: ({ row }) => <div> {row.getValue('municipality')}</div>,
    },

    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/aa/${id}/stakeholders/${row.original.uuid}`,
                )
              }
            />
            <Edit2
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              // onClick={() =>
              //   router.push(
              //     `/projects/el-cambodia/${id}/beneficiary/${row.original.uuid}`,
              //   )
              // }
            />

            <Trash2
              className="hover:text-primary cursor-pointer"
              color="red"
              size={16}
              strokeWidth={1.5}
              // onClick={() =>
              //   router.push(
              //     `/projects/el-cambodia/${id}/beneficiary/${row.original.uuid}`,
              //   )
              // }
            />
          </div>
        );
      },
    },
  ];

  return columns;
};

export const useProjectStakeholdersGroupTableColumns = () => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, id: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(id);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div> {row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone number',
      cell: ({ row }) => <div> {row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div> {row.getValue('email')}</div>,
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => <div> {row.getValue('designation')}</div>,
    },

    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => <div> {row.getValue('organization')}</div>,
    },
    {
      accessorKey: 'district',
      header: 'District',
      cell: ({ row }) => <div> {row.getValue('district')}</div>,
    },

    {
      accessorKey: 'municipality',
      header: 'Municipality',
      cell: ({ row }) => <div> {row.getValue('municipality')}</div>,
    },

    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              // onClick={() =>
              //   router.push(
              //     `/projects/el-cambodia/${id}/beneficiary/${row.original.uuid}`,
              //   )
              // }
            />
          </div>
        );
      },
    },
  ];

  return columns;
};

export const useProjectSelectStakeholdersTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate') ||
            false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div> {row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone number',
      cell: ({ row }) => <div> {row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div> {row.getValue('email')}</div>,
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => <div> {row.getValue('designation')}</div>,
    },

    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => <div> {row.getValue('organization')}</div>,
    },
    {
      accessorKey: 'district',
      header: 'District',
      cell: ({ row }) => <div> {row.getValue('district')}</div>,
    },

    {
      accessorKey: 'municipality',
      header: 'Municipality',
      cell: ({ row }) => <div> {row.getValue('municipality')}</div>,
    },
  ];

  return columns;
};
