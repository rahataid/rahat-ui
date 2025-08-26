'use client';
import { useFindC2CBeneficiaryGroups, usePagination } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, SearchInput, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import GroupCard from './group.card';

const BeneficiaryGroups = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { pagination, setFilters, filters } = usePagination();

  const {
    data: groups,
    meta,
    isLoading,
  } = useFindC2CBeneficiaryGroups(id as UUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters],
  );

  React.useEffect(() => {
    if (searchParams.get('tab') === 'beneficiaryGroups') {
      setFilters({ search: '' });
    }
  }, [searchParams]);
  return (
    <>
      {/* <div className="p-4 rounded-sm border"> */}
      {/* <div className="flex justify-between space-x-2 items-center mb-4">
          <SearchInput
            className="w-full"
            name="beneficary group"
            onSearch={(e) => handleSearch(e, 'search')}
            value={filters?.search || ''}
          />
        </div> */}
      <ScrollArea className="h-[calc(100vh-210px)] mb-2">
        {isLoading ? (
          <SpinnerLoader />
        ) : groups.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {groups?.map((group: any) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <NoResult message="No Beneficiary Group Available" />
        )}
      </ScrollArea>
      {/* </div> */}
    </>
  );
};

export default BeneficiaryGroups;
