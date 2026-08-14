import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Settings2 } from 'lucide-react';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

type IProps = {
  table: any;
};

const toGlobalKey = (id: string) =>
  id.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();

export default function ViewColumns({ table }: IProps) {
  const t = useTranslations('GLOBAL');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto text-muted-foreground">
          {t('VIEW')}
          <Settings2 className="ml-2 h-4 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('TOGGLE_COLUMNS')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column: any) => column.getCanHide())
          .map((column: any) => {
            const key = toGlobalKey(column.id);
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {translateValue(t, key, { fallback: column.id })}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
