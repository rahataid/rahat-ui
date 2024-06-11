import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { humanReadableDate, humanizeString } from '../../utils';
import { TempBeneficiary } from '@rahataid/sdk';
import { useTempBeneficiaryImport } from '@rahat-ui/query';
import { group } from 'console';
import { useRouter } from 'next/navigation';

export const useCommunityBeneficiaryGroupTableColumns = () => {
  const importTempBeneficiaries = useTempBeneficiaryImport();
  const router = useRouter();
  const handleImportBeneficiaries = async (args: string) => {
    const res = await importTempBeneficiaries.mutateAsync({
      groupUUID: args,
    });
    console.log(res);
    if (res?.response?.success) {
      router.push('/beneficiary');
    }
  };
  const columns: ColumnDef<TempBeneficiary>[] = [
    {
      header: 'Group Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        return <div>{humanReadableDate(row.getValue('createdAt'))}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      accessorKey: 'uuid',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-4 items-center">
            {/* <Link href={`/community-beneficiary/${groupName}`}>
              <Eye
                size={20}
                strokeWidth={1.5}
                className="cursor-pointer hover:text-primary"
              />
            </Link> */}

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleImportBeneficiaries(row.original.uuid as string)
              }
            >
              Import
            </Button>
          </div>
        );
      },
    },
  ];
  return columns;
};

export const useCommunityBeneficiaryTableColumns = () => {
  const columns: ColumnDef<ListBeneficiary>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row, table }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: 'Beneficiary Name',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.firstName} {row.original.lastName}
          </div>
        );
      },
    },

    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{humanizeString(row.getValue('phone'))}</div>,
    },

    {
      accessorKey: 'govtIDNumber',
      header: 'Govt. ID Number',
      cell: ({ row }) => (
        <div>{humanizeString(row.getValue('govtIDNumber')) || '-'}</div>
      ),
    },
  ];

  return columns;
};
