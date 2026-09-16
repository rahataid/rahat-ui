'use client';

import { SiteInfo, useSiteInfoList } from '@rahat-ui/query';
import { SystemUserAuth } from '@rahat-ui/auth';
import { TruncatedCell } from '../stakeholders/component/TruncatedCell';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { Pencil } from 'lucide-react';
import { DemoTable } from 'apps/rahat-ui/src/common';

export default function ListSiteInfo() {
  const g = useTranslations('GLOBAL');
  const t = useTranslations('NO_RESULTS');

  const { data, isPending } = useSiteInfoList();
  const columns: ColumnDef<SiteInfo>[] = [
    {
      header: g('NAME'),
      accessorKey: 'BRAND_NAME',
      cell: ({ row }) => <div>{row.getValue('BRAND_NAME')}</div>,
      filterFn: 'includesString',
    },
    {
      header: g('DESCRIPTION'),
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
      header: g('BACKGROUND'),
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
      header: g('LOGO'),
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
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-3">
            <SystemUserAuth hasContent={false}>
              <TooltipWrapper tip="Edit Site Info">
                <button
                  onClick={() => console.log('Edit Site Info')}
                  className="cursor-pointer"
                >
                  <Pencil size={18} />
                </button>
              </TooltipWrapper>
            </SystemUserAuth>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.data?.value ? [data.data.value] : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Site Info</h1>
      <p>Configure your site information here.</p>

      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-230px)]"
        loading={isPending}
        message={t('NO_PROJECTS_FOUND')}
      />
    </div>
  );
}
