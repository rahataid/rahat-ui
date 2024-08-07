'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import { useSecondPanel } from '../../providers/second-panel-provider';
interface AppAuthentication {
  name: string;
  publicKey: string;
}
export const useAppAuthenticationColumns = () => {
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<AppAuthentication>[] = [
    {
      header: 'App Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      header: 'Public Key',
      accessorKey: 'publicKey',
      cell: ({ row }) => <div>{row.getValue('publicKey')}</div>,
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => <div>{row.getValue('publicKey')}</div>,
    },
  ];

  return columns;
};
