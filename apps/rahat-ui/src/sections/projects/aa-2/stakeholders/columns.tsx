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

import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';

const SupportAreaCell = ({ supportArea }: { supportArea: string[] }) => {
  const [showAll, setShowAll] = React.useState(false);

  if (!supportArea || supportArea.length === 0) return null;

  const visibleItems = showAll ? supportArea : supportArea.slice(0, 1);

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visibleItems.map((area, index) => (
        <Badge key={index} className="w-auto text-[clamp(9px,0.8vw,12px)]">
          <TruncatedCell text={area} maxLength={14} />
        </Badge>
      ))}
      {supportArea.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAll((prev) => !prev);
          }}
          className="text-[clamp(8px,0.6vw,10px)] text-primary hover:underline whitespace-nowrap"
        >
          {showAll ? 'Show less' : `+${supportArea.length - 1} more`}
        </button>
      )}
    </div>
  );
};

export const useProjectStakeholdersTableColumns = (
  onConflict?: (groupNames: string[], stakeholderName: string) => void,
) => {
  const router = useRouter();
  const { id } = useParams();
  const removeStakeholder = useDeleteStakeholders();

  const handleDelete = async (uuid: string, stakeholderName: string) => {
    try {
      const response = await removeStakeholder.mutateAsync({
        projectUUID: id as UUID,
        stakeholderPayload: { uuid },
      });

      // Check if response indicates a conflict
      if (response?.data?.isSuccess === false && response?.data?.groupNames) {
        // Show conflict dialog with group names
        onConflict?.(response.data.groupNames, stakeholderName);
      }
      // If successful, the success handler in the mutation will show toast
    } catch (error) {
      // Error handler in the mutation will show error toast
      console.error('Error deleting stakeholder:', error);
    }
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.getValue('name')}
          maxLength={10}
          className="text-foreground"
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
      cell: ({ row }) => (
        <SupportAreaCell supportArea={row.original?.supportArea ?? []} />
      ),
    },

    {
      accessorKey: 'municipality',
      header: 'Municipality',
      meta: { className: 'hidden xl:table-cell' },
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('municipality')} maxLength={10} />
      ),
    },

    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      meta: { className: 'w-20 lg:w-28' },
      cell: ({ row }) => {
        return (
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <div className="flex items-center gap-2 [&_svg]:size-[clamp(14px,1.4vw,18px)]">
              <IconDialogComponent
                Icon={Edit2}
                buttonText=""
                confirmButtonText="Edit"
                dialogDescription="Are you sure you want to edit?"
                dialogTitle="Edit"
                tip="Edit"
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
                tip="Delete"
                handleClick={() => {
                  handleDelete(row.original.uuid, row.original.name);
                }}
                variant="destructive"
                color="red"
              />
              <TooltipComponent
                Icon={Eye}
                tip="View Details"
                iconStyle="hover:text-primary cursor-pointer"
                handleOnClick={() =>
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
      cell: ({ row }) => (
        <SupportAreaCell supportArea={row.original?.supportArea ?? []} />
      ),
    },
    {
      accessorKey: 'municipality',
      header: 'Municipality',
      meta: { className: 'hidden xl:table-cell' },
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('municipality')} maxLength={10} />
      ),
    },

    {
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      meta: { className: 'w-15 lg:w-20' },
      cell: ({ row }) => {
        return (
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <div className="flex items-center gap-2 [&_svg]:size-[clamp(14px,1.4vw,18px)]">
              <TooltipComponent
                Icon={Eye}
                tip="View Details"
                iconStyle="hover:text-primary cursor-pointer"
                handleOnClick={() =>
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
      meta: { className: 'hidden xl:table-cell' },
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
      cell: ({ row }) => (
        <SupportAreaCell supportArea={row.original?.supportArea ?? []} />
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
