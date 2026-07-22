import React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'libs/shadcn/src/components/ui/dropdown-menu';
import { Button } from 'libs/shadcn/src/components/ui/button';
import { Settings2 } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

type IProps = {
  table: Table<any>;
};

export function ToggleColumns({ table }: IProps) {
  const t = useTranslations('GLOBAL');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Settings2 className="mr-2 h-4 w-5" />
          {t('VIEW')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('TOGGLE_COLUMNS')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
