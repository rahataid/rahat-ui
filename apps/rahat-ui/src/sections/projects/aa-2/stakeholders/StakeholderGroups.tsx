import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  AddButton,
  NoResult,
  SearchInput,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { Users } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import {
  useStakeholdersGroups,
  useStakeholdersGroupsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { RoleAuth, AARoles } from '@rahat-ui/auth';

const StakeGoldersGroups = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = React.useState({ search: '' });

  const { isLoading } = useStakeholdersGroups(id as UUID, {
    sort: 'createdAt',
    order: 'desc',
    perPage: 1000,
    ...filters,
  });

  const { stakeholdersGroups } = useStakeholdersGroupsStore((state) => ({
    stakeholdersGroups: state.stakeholdersGroups,
  }));

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters],
  );

  React.useEffect(() => {
    if (searchParams.get('tab') === 'stakeholdersGroup') {
      setFilters({ search: '' });
    }
  }, [searchParams]);
  return (
    <>
      <div
        className="p-4 compact:p-2 rounded-sm border flex flex-col"
        style={{ height: 'calc(100vh - 220px)' }}
      >
        <div className="flex justify-between space-x-2 items-center mb-4 compact:mb-2 shrink-0">
          <SearchInput
            className="w-full compact:[&_input]:h-7 compact:[&_input]:text-xs"
            name="stakeholders group"
            onSearch={(e) => handleSearch(e, 'search')}
            value={filters?.search || ''}
          />

          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <AddButton
              path={`/projects/aa/${id}/stakeholders/groups/add`}
              name="Stakeholder Group"
              className="shrink-0 compact:h-7 compact:text-xs compact:px-2"
            />
          </RoleAuth>
        </div>
        <ScrollArea className="flex-1 min-h-0">
          {isLoading ? (
            <SpinnerLoader />
          ) : stakeholdersGroups.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 compact:grid-cols-4 gap-4 compact:gap-2 pb-2">
              {stakeholdersGroups?.map((i: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="rounded-sm border shadow p-4 compact:p-2"
                  >
                    <div className="flex flex-col space-y-2 compact:space-y-1">
                      <div
                        className="cursor-pointer rounded-sm bg-secondary grid place-items-center h-28 compact:h-16"
                        onClick={() => {
                          router.push(
                            `/projects/aa/${id}/stakeholders/groups/${i.uuid}`,
                          );
                        }}
                      >
                        <div className="bg-[#667085] text-white p-2 compact:p-1.5 rounded-full">
                          <Users
                            size={20}
                            strokeWidth={2.5}
                            className="compact:w-4 compact:h-4"
                          />
                        </div>
                      </div>

                      <p className="text-base compact:text-xs mb-1">
                        {i?.name ?? 'N/A'}
                      </p>
                      <div className="flex gap-2 items-center compact:text-xs">
                        <Users
                          size={18}
                          strokeWidth={2}
                          className="compact:w-3.5 compact:h-3.5"
                        />
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
      </div>
    </>
  );
};

export default StakeGoldersGroups;
