import { SiteInfo } from '@rahat-ui/query';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { TruncatedCell } from '../stakeholders/component/TruncatedCell';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { SystemUserAuth } from '@rahat-ui/auth';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
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
        cell: ({ row }) => <div>{row.getValue('BRAND_NAME')}</div>,
        filterFn: 'includesString',
      },
      {
        header: t('BRAND_DESCRIPTION'),
        accessorKey: 'BRAND_DESCRIPTION',
        cell: ({ row }) => (
          <div>
            <TruncatedCell
              text={row.getValue('BRAND_DESCRIPTION')}
              truncateByWidth
            />
          </div>
        ),
      },
      {
        header: t('BACKGROUND_IMAGE'),
        accessorKey: 'SITE_BACKGROUND_IMAGE',
        cell: ({ row }) => (
          <a
            href={row.original.SITE_BACKGROUND_IMAGE}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TruncatedCell
              text={row.getValue('SITE_BACKGROUND_IMAGE')}
              truncateByWidth
            />
          </a>
        ),
      },
      {
        header: t('BRAND_LOGO'),
        accessorKey: 'BRAND_LOGO',
        cell: ({ row }) => (
          <a
            href={row.original.BRAND_LOGO}
            target="_blank"
            rel="noopener noreferrer"
          >
            <TruncatedCell text={row.getValue('BRAND_LOGO')} truncateByWidth />
          </a>
        ),
      },
      {
        id: 'actions',
        header: g('ACTIONS'),
        cell: () => (
          <div className="flex items-center space-x-3">
            {/* <SystemUserAuth hasContent={false}> */}
            <TooltipWrapper tip="Edit Site Info">
              <button
                onClick={() => router.push('/site-info/edit')}
                className="cursor-pointer"
              >
                <Edit size={18} />
              </button>
            </TooltipWrapper>
            {/* </SystemUserAuth> */}
          </div>
        ),
      },
    ],
    [g, router],
  );
  return columns;
};
