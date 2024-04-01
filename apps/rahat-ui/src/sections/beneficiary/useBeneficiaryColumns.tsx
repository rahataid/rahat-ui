'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Beneficiary } from '@rahataid/sdk/types';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Eye, Copy } from 'lucide-react';
import BeneficiaryDetail from './beneficiaryDetail';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export const useBeneficiaryTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
  };

  const columns: ColumnDef<Beneficiary>[] = [
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
      accessorKey: 'piiData',
      header: 'Name',
      cell: ({ row }) => {
        const piiData = row.getValue('piiData') as any;
        return <div>{piiData?.name || '-'}</div>;
      },
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex gap-3 cursor-pointer"
              onClick={() => clickToCopy(row.getValue('walletAddress'))}
            >
              <p>{truncateEthAddress(row.getValue('walletAddress'))}</p>
              <Copy size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">click to copy</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'internetStatus',
      header: 'Internet Access',
      cell: ({ row }) => <div>{row.getValue('internetStatus')}</div>,
    },
    {
      accessorKey: 'phoneStatus',
      header: 'Phone Type',
      cell: ({ row }) => <div>{row.getValue('phoneStatus')}</div>,
    },
    {
      accessorKey: 'bankedStatus',
      header: 'Banking Status',
      cell: ({ row }) => <div>{row.getValue('bankedStatus')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() =>
              setSecondPanelComponent(
                <BeneficiaryDetail
                  beneficiaryDetail={row.original}
                  closeSecondPanel={closeSecondPanel}
                />,
              )
            }
          />
        );
      },
    },
  ];

  return columns;
};
