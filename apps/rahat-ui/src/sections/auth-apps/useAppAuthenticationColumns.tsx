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
import { useTranslations } from 'next-intl';
interface AppAuthentication {
  name: string;
  publicKey: string;
}
export const useAppAuthenticationColumns = () => {
  const t = useTranslations('Auth Apps – List');
  const tg = useTranslations('GLOBAL');
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const columns: ColumnDef<AppAuthentication>[] = [
    {
      header: t('APP_NAME'),
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      header: tg('ADDRESS'),
      accessorKey: 'address',
      cell: ({ row }) => <div>{row.getValue('address')}</div>,
    },
    {
      header: tg('DESCRIPTION'),
      accessorKey: 'description',
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
  ];

  return columns;
};
