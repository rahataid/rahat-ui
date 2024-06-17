import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { formatdbDate } from 'apps/rahat-ui/src/utils';

export type Disbursements = {
  owner: string;
  hasApproved: boolean;
  submissionDate: string;
};

export const useApprovalTable = () => {
  const columns: ColumnDef<Disbursements>[] = [
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
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('owner')}</div>
      ),
    },
    {
      accessorKey: 'hasApproved',
      header: 'Status',
      cell: ({ row }) => (
        <div>{row.getValue('hasApproved') ? 'Approved' : 'Not Approved'}</div>
      ),
    },
    {
      accessorKey: 'submissionDate',
      header: 'Submission Date',
      cell: ({ row }) => (
        <div>{row.getValue('submissionDate') ? formatdbDate(row.getValue('submissionDate')) : 'N/A'}</div>
      ),
    },
  ];
  return columns;
};
