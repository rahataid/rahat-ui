import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

type VendorType = {
  name: string;
  walletaddress: string;
};

interface VendorTableProps {
  handleViewClick: any;
}

export const useVendorTable = ({ handleViewClick }: VendorTableProps) => {
  const columns: ColumnDef<VendorType>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('walletAddress')}</div>
      ),
    },
    // {
    //   accessorKey: 'phone',
    //   header: 'Phone',
    //   cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    // },

    // {
    //   accessorKey: 'totalTokenRedeemed',
    //   header: 'Total Tokens Redeemed',
    //   cell: ({ row }) => (
    //     <div>{truncateEthAddress(row.getValue('tokenTokenRedeemed'))}</div>
    //   ),
    // },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewClick(rowData)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
