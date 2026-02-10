'use client';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { IconDialogComponent } from './component/iconDialog';
import { useDeleteStakeholders } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

import { TruncatedCell } from './component/TruncatedCell';

export const useProjectStakeholdersTableColumns = () => {
  const router = useRouter();
  const { id } = useParams();
  const removeStakeholder = useDeleteStakeholders();

  const handleDelete = async (uuid: string) => {
    await removeStakeholder.mutateAsync({
      projectUUID: id as UUID,
      stakeholderPayload: { uuid },
    });
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.getValue('name')}
          maxLength={10}
          className="font-medium"
        />
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone number',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('phone')} maxLength={14} />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('email')} maxLength={10} />
      ),
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('designation')} maxLength={10} />
      ),
    },

    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('organization')} maxLength={10} />
      ),
    },
    {
      accessorKey: 'supportArea',
      header: 'Support Area',
      cell: ({ row }) =>
        row?.original?.supportArea.length > 0 ? (
          <Badge className="w-auto">
            <TruncatedCell text={row.original.supportArea[0]} maxLength={10} />
          </Badge>
        ) : (
          []
        ),
    },

    {
      accessorKey: 'municipality',
      header: 'Municipality',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('municipality')} maxLength={10} />
      ),
    },

    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <div className="flex items-center gap-2">
              <IconDialogComponent
                Icon={Edit2}
                buttonText=""
                confirmButtonText="Edit"
                dialogDescription="Are you sure you want to edit?"
                dialogTitle="Edit"
                handleClick={() =>
                  setTimeout(() => {
                    router.push(
                      `/projects/aa/${id}/stakeholders/${row.original.uuid}/edit?from="listPage"`,
                    );
                  }, 500)
                }
                variant="default"
              />
              <IconDialogComponent
                Icon={Trash2}
                buttonText=""
                confirmButtonText="Delete"
                dialogDescription="Are you sure you want to delete?"
                dialogTitle="Delete"
                handleClick={() => {
                  handleDelete(row.original.uuid);
                }}
                variant="destructive"
                color="red"
              />
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
            </div>
          </RoleAuth>
        );
      },
    },
  ];

  return columns;
};

export const useProjectStakeholdersGroupTableColumns = () => {
  const router = useRouter();
  const { id, groupId } = useParams();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('name')} maxLength={10} />
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone number',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('phone')} maxLength={14} />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('email')} maxLength={10} />
      ),
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('designation')} maxLength={14} />
      ),
    },

    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('organization')} maxLength={10} />
      ),
    },
    {
      accessorKey: 'supportArea',
      header: 'Support Area',
      cell: ({ row }) =>
        row?.original?.supportArea.length > 0 ? (
          <Badge className="w-auto">
            <TruncatedCell text={row.original.supportArea[0]} maxLength={14} />
          </Badge>
        ) : (
          []
        ),
    },
    {
      accessorKey: 'municipality',
      header: 'Municipality',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('municipality')} maxLength={10} />
      ),
    },

    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <div className="flex items-center gap-2">
              <Eye
                className="hover:text-primary cursor-pointer"
                size={16}
                strokeWidth={1.5}
                onClick={() =>
                  router.push(
                    `/projects/aa/${id}/stakeholders/${row.original.uuid}?groupId=${groupId}`,
                  )
                }
              />
            </div>
          </RoleAuth>
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
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('name')} maxLength={10} />
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone number',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('phone')} maxLength={14} />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('email')} maxLength={14} />
      ),
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('designation')} maxLength={10} />
      ),
    },

    {
      accessorKey: 'organization',
      header: 'Organization',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('organization')} maxLength={10} />
      ),
    },
    {
      accessorKey: 'supportArea',
      header: 'Support Area',
      cell: ({ row }) =>
        row?.original?.supportArea.length > 0 ? (
          <Badge className="w-auto">
            <TruncatedCell text={row.original.supportArea[0]} maxLength={14} />
          </Badge>
        ) : (
          []
        ),
    },

    {
      accessorKey: 'municipality',
      header: 'Municipality',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('municipality')} maxLength={14} />
      ),
    },
  ];

  return columns;
};
