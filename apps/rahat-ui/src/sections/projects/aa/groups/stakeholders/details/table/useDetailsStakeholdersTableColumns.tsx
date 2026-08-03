import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/usePhoneFormat';

export default function useDetailsStakeholdersTableColumn() {
    const tg = useTranslations('GLOBAL');
    const t = useTranslations('AA_PROJECT');
    const formatPhone = usePhoneFormat();
    const columns: ColumnDef<IStakeholdersItem>[] = [
        {
            accessorKey: 'name',
            header: tg('NAME'),
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'phone',
            header: tg('PHONE'),
            cell: ({ row }) => <div>{formatPhone(row.getValue('phone')) || tg('N_A')}</div>,
        },
        {
            accessorKey: 'email',
            header: tg('EMAIL_ADDRESS'),
            cell: ({ row }) => <div>{row.getValue('email') || tg('N_A')}</div>,
        },
        {
            accessorKey: 'designation',
            header: t('DESIGNATION'),
            cell: ({ row }) => <div>{row.getValue('designation')}</div>,
        },
        {
            accessorKey: 'organization',
            header: tg('ORGANIZATION'),
            cell: ({ row }) => <div>{row.getValue('organization')}</div>,
        },
        {
            accessorKey: 'district',
            header: t('DISTRICT'),
            cell: ({ row }) => <div>{row.getValue('district')}</div>,
        },
        {
            accessorKey: 'municipality',
            header: tg('MUNICIPALITY'),
            cell: ({ row }) => <div>{row.getValue('municipality')}</div>,
        },
    ];

    return columns;
}
