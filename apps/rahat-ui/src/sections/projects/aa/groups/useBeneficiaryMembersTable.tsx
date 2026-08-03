import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/usePhoneFormat';

export default function useBeneficiaryMembersTableColumn(members?: any) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatPhone = usePhoneFormat();
  const [prevData, setPrevData] = React.useState(members);
  const columns: ColumnDef<IStakeholdersItem>[] = [
    {
      id: 'select',
      header: ({ table }) => {
        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const isMember = prevData?.stakeholders?.some(
          (s: any) => s.uuid === row.original.uuid,
        );
        if (isMember && !row.getIsSelected()) {
          row.toggleSelected(true);
        }
        return (
          <Checkbox
            checked={row.getIsSelected() || isMember}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              if (prevData) {
                setPrevData((prevData: any) => ({
                  ...prevData,
                  stakeholders: prevData.stakeholders.filter(
                    (s: any) => s.uuid !== row.original.uuid,
                  ),
                }));
              }
            }}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'wallet',
      header: t('WALLET'),
      cell: ({ row }) => <div>{row.getValue('wallet')}</div>,
    },
    {
      accessorKey: 'name',
      header: tg('NAME'),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'email',
      header: tg('EMAIL_ADDRESS'),
      cell: ({ row }) => <div>{row.getValue('email') || tg('N_A')}</div>,
    },
    {
      accessorKey: 'phone',
      header: tg('PHONE'),
      cell: ({ row }) => <div>{formatPhone(row.getValue('phone')) || tg('N_A')}</div>,
    },
    {
      accessorKey: 'gender',
      header: tg('GENDER'),
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
  ];

  return columns;
}
