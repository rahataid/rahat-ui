'use client';

import { useMemo, useState } from 'react';
import { useSiteInfoList } from '@rahat-ui/query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { DemoTable } from 'apps/rahat-ui/src/common';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import SiteInfoPreview from './siteInfo.preview';
import { useSiteInfoColumns } from './siteInfo.columns';

export default function ListSiteInfo() {
  const t = useTranslations('SITE_INFO');
  const [activeTab, setActiveTab] = useState('configuration');
  const { data, isPending } = useSiteInfoList();

  const columns = useSiteInfoColumns();
  const tableData = useMemo(
    () => (data?.data?.value ? [data.data.value] : []),
    [data],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  const siteInfo = data?.data?.value;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Site Info</h1>
      <p>Configure your site information here.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            value="configuration"
            className="w-full data-[state=active]:bg-primary data-[state=active]:text-white "
          >
            Configuration
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="w-full data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="configuration">
          <DemoTable
            table={table}
            tableHeight="h-[calc(100vh-230px)]"
            loading={isPending}
            message={t('NO_SITE_INFO_FOUND')}
          />
        </TabsContent>
        <TabsContent value="preview">
          <SiteInfoPreview data={siteInfo} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
