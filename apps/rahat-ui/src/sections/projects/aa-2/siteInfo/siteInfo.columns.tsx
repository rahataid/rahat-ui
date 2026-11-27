import { SiteInfo } from '@rahat-ui/query';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { TruncatedCell } from '../stakeholders/component/TruncatedCell';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { GlobalCan } from 'apps/rahat-ui/src/components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { Edit } from 'lucide-react';

export const useSiteInfoColumns = () => {
  const g = useTranslations('GLOBAL');
  const t = useTranslations('SITE_INFO');
  const router = useRouter();
  const columns = useMemo<ColumnDef<SiteInfo>[]>(
    () => [
      {
        header: g('NAME'),
        accessorKey: 'BRAND_NAME',
        cell: ({ row }) => (
          <div>{(row.getValue('BRAND_NAME') as string) || 'N/A'}</div>
        ),
        filterFn: 'includesString',
      },
      {
        header: t('BRAND_DESCRIPTION'),
        accessorKey: 'BRAND_DESCRIPTION',
        cell: ({ row }) => (
          <div>
            <TruncatedCell
              text={(row.getValue('BRAND_DESCRIPTION') as string) || 'N/A'}
              truncateByWidth
            />
          </div>
        ),
      },
      {
        header: t('BACKGROUND_IMAGE'),
        accessorKey: 'SITE_BACKGROUND_IMAGE',
        cell: ({ row }) => {
          const url = row.getValue('SITE_BACKGROUND_IMAGE') as string;
          if (!url) return <span className="text-muted-foreground">N/A</span>;
          return (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <TruncatedCell text={url} truncateByWidth />
            </a>
          );
        },
      },
      {
        header: t('BRAND_LOGO'),
        accessorKey: 'BRAND_LOGO',
        cell: ({ row }) => {
          const url = row.getValue('BRAND_LOGO') as string;
          if (!url) return <span className="text-muted-foreground">N/A</span>;
          return (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <TruncatedCell text={url} truncateByWidth />
            </a>
          );
        },
      },
      {
        id: 'actions',
        header: g('ACTIONS'),
        cell: () => (
          <div className="flex items-center space-x-3">
            <GlobalCan action={ACTIONS.UPDATE} subject={SUBJECTS.SETTINGS}>
              <TooltipWrapper tip={t('EDIT_SITE_INFO')}>
                <button
                  onClick={() => router.push('/site-info/edit')}
                  className="cursor-pointer"
                >
                  <Edit size={18} />
                </button>
              </TooltipWrapper>
            </GlobalCan>
          </div>
        ),
      },
    ],
    [g, router],
  );
  return columns;
};
