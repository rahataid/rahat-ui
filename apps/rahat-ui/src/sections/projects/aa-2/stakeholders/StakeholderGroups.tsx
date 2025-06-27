import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  AddButton,
  CustomPagination,
  NoResult,
  SearchInput,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { Users } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import {
  usePagination,
  useStakeholdersGroups,
  useStakeholdersGroupsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { RoleAuth, AARoles } from '@rahat-ui/auth';

const StakeGoldersGroups = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setPagination,
    setFilters,
  } = usePagination();

  const { isLoading } = useStakeholdersGroups(id as UUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    sort: 'createdAt',
    order: 'desc',
    ...filters,
  });

  const { stakeholdersGroups, stakeholdersGroupsMeta } =
    useStakeholdersGroupsStore((state) => ({
      stakeholdersGroups: state.stakeholdersGroups,
      stakeholdersGroupsMeta: state.stakeholdersGroupsMeta,
    }));

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  return (
    <>
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-4">
          <SearchInput
            className="w-full"
            name="stakeholders group"
            onSearch={(e) => handleSearch(e, 'search')}
            value={filters?.search || ''}
          />

          <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]} hasContent={false}>
            <AddButton
              path={`/projects/aa/${id}/stakeholders/groups/add`}
              name="Stakeholder Group"
            />
          </RoleAuth>
        </div>
        <ScrollArea className="h-[calc(100vh-360px)] mb-2">
          {isLoading ? (
            <SpinnerLoader />
          ) : stakeholdersGroups.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stakeholdersGroups?.map((i: any, index: number) => {
                return (
                  <div key={index} className="rounded-md border shadow p-4">
                    <div className="flex flex-col space-y-2">
                      <div
                        className="cursor-pointer rounded-md bg-secondary grid place-items-center h-28"
                        onClick={() => {
                          router.push(
                            `/projects/aa/${id}/stakeholders/groups/${i.uuid}`,
                          );
                        }}
                      >
                        <div className="bg-[#667085] text-white p-2 rounded-full">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>

                      <p className="text-base mb-1">{i?.name ?? 'N/A'}</p>
                      <div className="flex gap-2 items-center">
                        <Users size={18} strokeWidth={2} />
                        {i?._count?.stakeholders || 0}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoResult message="No Stakeholder Groups Available" />
          )}
        </ScrollArea>

        <CustomPagination
          meta={
            stakeholdersGroupsMeta || {
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

export default StakeGoldersGroups;
