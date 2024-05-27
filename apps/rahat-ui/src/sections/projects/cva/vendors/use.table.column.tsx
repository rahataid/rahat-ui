import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useCallback, useState } from 'react';
import VendorDetail from './vendors.detail';

export type Payment = {
  id: string;
  name: number;
  email: string;
  wallet: string;
  phone: string;
};

export const useCvaVendorsTableColumn = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const openSplitDetailView = useCallback((rowDetail: any) => {
    setSecondPanelComponent(
      <VendorDetail closeSecondPanel={closeSecondPanel} />,
    );
  }, []);

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div
          className="capitalize cursor-pointer"
          onClick={() => openSplitDetailView(row.original)}
        >
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('phone')}</div>
      ),
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('wallet')}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => openSplitDetailView(row.original)}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>Edit details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
