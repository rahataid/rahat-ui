'use client';
import {
  useBeneficiariesGroups,
  useBeneficiariesGroupStore,
  usePagination,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  CustomPagination,
  NoResult,
  SearchInput,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { GroupPurpose } from 'apps/rahat-ui/src/constants/beneficiary.const';
import { UUID } from 'crypto';
import { LandmarkIcon, Phone, Users, Banknote } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';

const BeneficiaryGroups = () => {
  const { id } = useParams();
  const uuid = id as UUID;
  const searchParams = useSearchParams();
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();
  const router = useRouter();
  const { data, isLoading } = useBeneficiariesGroups(id as UUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    sort: 'updatedAt',
    order: 'desc',
    ...filters,
  });
  const { beneficiariesGroups, beneficiariesGroupsMeta } =
    useBeneficiariesGroupStore((state) => ({
      beneficiariesGroups: state.beneficiariesGroups,
      beneficiariesGroupsMeta: state.beneficiariesGroupsMeta,
    }));
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  React.useEffect(() => {
    if (searchParams.get('tab') === 'beneficiaryGroups') {
      setFilters({});
    }
  }, [searchParams]);
  return (
    <>
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-4">
          <SearchInput
            className="w-full"
            name="beneficary group"
            onSearch={(e) => handleSearch(e, 'search')}
            value={filters?.search || ''}
          />
        </div>
        <ScrollArea className="h-[calc(100vh-360px)] mb-2">
          {isLoading ? (
            <SpinnerLoader />
          ) : beneficiariesGroups.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {beneficiariesGroups.map((i: any, index: number) => {
                const groupPurposeName = i?.groupPurpose?.split('_')[0];
                return (
                  <div key={index} className="rounded-md border shadow p-4">
                    <div className="flex flex-col space-y-2">
                      <div
                        className="cursor-pointer rounded-md bg-secondary grid place-items-center h-28"
                        onClick={() => {
                          router.push(
                            `/projects/aa/${id}/beneficiary/groupDetails/${i.uuid}`,
                          );
                        }}
                      >
                        <div className="bg-[#667085] text-white p-2 rounded-full">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-base capitalize">
                          {i?.name ?? 'N/A'}
                        </p>
                        {(i?.groupPurpose === GroupPurpose.BANK_TRANSFER ||
                          i?.groupPurpose === GroupPurpose.MOBILE_MONEY) && (
                          <>
                            {i?.groupPurpose === GroupPurpose.BANK_TRANSFER && (
                              <LandmarkIcon className="h-4 w-4 text-green-600" />
                            )}
                            {i?.groupPurpose === GroupPurpose.MOBILE_MONEY && (
                              <Phone className="h-4 w-4 text-green-600" />
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex text-sm text-gray-500 justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Users size={18} strokeWidth={2} />
                          {i?._count?.groupedBeneficiaries || 0} beneficiaries
                        </div>

                        {i?.tokensReserved?.numberOfTokens && (
                          <div className="flex justify-center items-center gap-1">
                            <Banknote className="h-4 w-4" />
                            {i?.tokensReserved?.numberOfTokens}
                          </div>
                        )}
                      </div>
                      {groupPurposeName && (
                        <div>
                          <Badge>{groupPurposeName}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoResult message="No Beneficiary Group Available" />
          )}
        </ScrollArea>

        <CustomPagination
          meta={
            beneficiariesGroupsMeta || {
              total: 0,
              currentPage: 0,
              lastPage: 0,
              perPage: 0,
              next: null,
              prev: null,
            }
          }
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={0}
          setPagination={setPagination}
        />
      </div>
    </>
  );
};

export default BeneficiaryGroups;
