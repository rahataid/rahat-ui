'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';
import { memo, useState } from 'react';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useParams, useSearchParams } from 'next/navigation';

import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import BeneficiaryGroups from './BeneficiaryGroups';
import { useProjectBeneficiaryTableColumns } from './columns';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import BeneficiaryTable from './beneficiary.table';
function BeneficiaryView() {
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams();
  const uuid = id as UUID;
  const { activeTab, setActiveTab } = useActiveTab('beneficiary');

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="beneficiary">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">{tg('BENEFICIARY')}</h1>
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">
            {t('BENEFICIARY_GROUP')}s
          </h1>
        </div>
      </TabsContent>
      <p className="text-muted-foreground text-left pl-4 mb-0 pb-0">
        {t('TRACK_ALL_THE_BENEFICIARIES_IN_THE')}
      </p>

      <div className="flex justify-between items-center p-4">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            id="beneficiary"
            className="w-full data-[state=active]:bg-white"
            value="beneficiary"
          >
            {tg('BENEFICIARY')}
          </TabsTrigger>
          <TabsTrigger
            id="beneficiaryGroups"
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryGroups"
          >
            {t('BENEFICIARY_GROUP')}s
          </TabsTrigger>
        </TabsList>

        {/* <Button
          variant="outline"
          onClick={() => router.push('/beneficiary/import')}
        >
          <CloudDownload className="mr-1" /> Import beneficiaries
        </Button> */}
      </div>
      <TabsContent value="beneficiary">
        <div className="px-4">
          {/* <div className="p-4 rounded-sm border">
            <div className="flex mb-2 gap-2">
              <SearchInput
                className="w-full"
                name={tg('WALLET_ADDRESS')}
                onSearch={(e) => handleSearch(e, 'search')}
                value={filters?.search || ''}
              />
            </div>
            <DemoTable table={table} loading={projectBeneficiaries.isLoading} />

            <CustomPagination
              currentPage={pagination.page}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              setPagination={setPagination}
              meta={
                (projectBeneficiaries?.data?.response?.meta as any) || {
                  total: 0,
                  currentPage: 0,
                }
              }
              perPage={pagination?.perPage}
              total={projectBeneficiaries?.data?.response?.meta?.total || 0}
            />
          </div> */}
          <BeneficiaryTable />
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        {/* TODO : Remaining  for the beneficiary groups query */}
        <div className="px-4">
          <BeneficiaryGroups />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default memo(BeneficiaryView);
