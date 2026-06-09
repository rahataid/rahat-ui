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
      <div className="p-3 md:p-2 rounded-sm border">
        <div className="flex flex-row flex-wrap gap-2 mb-2">
          <SearchInput
            className="flex-1 min-w-[180px]"
            // inputClassName="h-7 md:h-7 lg:h-9 "
            inputClassName="h-[clamp(28px,3vw,36px)]"
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
              // className="text-xs sm:text-sm h-9"
              className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
            />
          </RoleAuth>
        </div>
        <ScrollArea className="h-[max(200px,calc(100vh-380px))] mb-2">
          {isLoading ? (
            <SpinnerLoader />
          ) : stakeholdersGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stakeholdersGroups?.map((i: any, index: number) => {
                return (
                  <div key={index} className="rounded-sm border shadow p-[clamp(8px,1.5vw,16px)]">
                    <div className="flex flex-col space-y-2">
                      <div
                        className="cursor-pointer rounded-sm bg-secondary grid place-items-center h-[clamp(64px,10vw,112px)]"
                        onClick={() => {
                          router.push(
                            `/projects/aa/${id}/stakeholders/groups/${i.uuid}`,
                          );
                        }}
                      >
                        <div className="bg-[#667085] text-white p-2 rounded-full [&_svg]:size-[clamp(14px,1.6vw,20px)]">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>

                      <p className="text-[clamp(12px,1.4vw,16px)] mb-1">{i?.name ?? 'N/A'}</p>
                      <div className="flex gap-2 items-center text-[clamp(11px,1vw,14px)] [&_svg]:size-[clamp(12px,1.4vw,18px)]">
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
      </div>
    </>
  );
};

export default StakeGoldersGroups;
