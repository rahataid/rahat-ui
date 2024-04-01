'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ListBeneficiary } from '@rahat-ui/types';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import UserDetail from './viewUser';
import { Eye, Copy } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export const useUserTableColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
  };

  const columns: ColumnDef<ListBeneficiary>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex gap-3 cursor-pointer"
              onClick={() => clickToCopy(row.getValue('wallet'))}
            >
              <p>{truncateEthAddress(row.getValue('wallet'))}</p>
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
                <>
                  <UserDetail
                    userDetail={row.original}
                    closeSecondPanel={closeSecondPanel}
                  />
                </>,
              )
            }
          />
        );
      },
    },
  ];

  return columns;
};
