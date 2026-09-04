'use client';
import React, { memo, useEffect, useRef } from 'react';

import { useBeneficiaryGroupsList, usePagination } from '@rahat-ui/query';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { LandmarkIcon, Loader2, Phone, Plus, Users } from 'lucide-react';
import SearchInput from '../../projects/components/search.input';
import AddButton from '../../projects/components/add.btn';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRouter } from 'next/navigation';
import AssignBeneficiaryToProjectModal from './assignToProjectModal';
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { GroupPurpose } from 'apps/rahat-ui/src/constants/beneficiary.const';
import { TruncatedCell } from '../../projects/aa-2/stakeholders/component/TruncatedCell';

function BeneficiaryGroupsView() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedGroup, setSelectedGroup] =
    React.useState<ListBeneficiaryGroup>([]);
  const { setFilters, filters } = usePagination();
  const [limit, setLimit] = React.useState(20);
  const [visibleLimit, setVisibleLimit] = React.useState(20);
  const [allGroups, setAllGroups] = React.useState<any[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const data = useBeneficiaryGroupsList({
    page: 1,
    perPage: limit,
    order: 'desc',
    sort: 'createdAt',
    ...filters,
  });

  const isLoading =
    allGroups.length === 0 && (data?.isLoading || data?.isFetching);
  const total = data?.meta?.total ?? 0;
  const hasMore = visibleLimit < total;

  useEffect(() => {
    if (!data?.data) return;
    setAllGroups(data.data);
  }, [data.dataUpdatedAt]);

  // Prefetch the next batch as soon as the current fetch lands, staying one batch ahead.
  useEffect(() => {
    if (data.isFetching) return;
    if (allGroups.length < limit) return;
    if (limit >= total) return;
    if (limit >= visibleLimit + 9) return;
    setLimit((l) => l + 9);
  }, [data.isFetching, allGroups, limit, visibleLimit, total]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      setVisibleLimit((v) => Math.min(v + 12, Math.max(allGroups.length, v)));
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, allGroups.length]);

  const visibleGroups = React.useMemo(
    () => allGroups.slice(0, visibleLimit),
    [allGroups, visibleLimit],
  );

  const filteredGroups = React.useMemo(() => {
    return visibleGroups.filter((group) =>
      group.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [visibleGroups, searchTerm]);

  const loadingMore =
    hasMore && data.isFetching && allGroups.length <= visibleLimit;

  const handleSearch = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const projectModal = useBoolean();

  const handleAssignModalClick = (data: any) => {
    projectModal.onTrue();
    setSelectedGroup(data);
  };

  const assignedGroupId = selectedGroup?.beneficiaryGroupProject?.map(
    (benProject: any) => benProject.Project.id,
  );
  return (
    <>
      <AssignBeneficiaryToProjectModal
        beneficiaryGroupDetail={selectedGroup as ListBeneficiaryGroup}
        projectModal={projectModal}
        assignedGroupId={assignedGroupId}
      />
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-4">
          <SearchInput
            className="w-full"
            name="group"
            onSearch={(e) => handleSearch(e.target.value)}
          />
          <Button
            variant={'default'}
            type="button"
            onClick={() => router.push(`/beneficiary/groups/add`)}
          >
            <Plus size={18} className="mr-1" /> Create Group
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredGroups.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredGroups?.map((i: any, index: number) => {
                const isAssignedToProject = i?.beneficiaryGroupProject?.length;

                return (
                  <div
                    key={index}
                    className="rounded-sm border shadow p-4 flex flex-col cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/beneficiary/groups/${i?.uuid}?isAssignedToProject=${isAssignedToProject}&isGroupValidForAA=${i?.isGroupValidForAA}&fromTab=beneficiaryGroups`,
                      );
                    }}
                  >
                    <div className="flex-grow">
                      <div className="mb-2">
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-semibold mb-1 text-[#3D3D51]">
                            <TruncatedCell text={i?.name ?? 'N/A'} />
                          </p>
                          <div>
                            {i?.isGroupValidForAA &&
                              (i?.groupPurpose === GroupPurpose.BANK_TRANSFER ||
                                i?.groupPurpose ===
                                  GroupPurpose.MOBILE_MONEY) && (
                                <>
                                  {i?.groupPurpose ===
                                    GroupPurpose.BANK_TRANSFER && (
                                    <LandmarkIcon className="h-4 w-4 text-green-600" />
                                  )}
                                  {i?.groupPurpose ===
                                    GroupPurpose.MOBILE_MONEY && (
                                    <Phone className="h-4 w-4 text-green-600" />
                                  )}
                                </>
                              )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex gap-2 items-center text-[#667085]">
                            <Users size={18} strokeWidth={2} />
                            {i?._count?.groupedBeneficiaries || 0} beneficiaries
                          </div>
                          {i?.groupPurpose && (
                            <Badge className="text-gray-700 font-normal text-xs">
                              {capitalizeFirstLetter(
                                i?.groupPurpose?.split('_')[0] || '',
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm/6 text-[#505868] mb-2">
                          Projects Involved
                        </p>
                        <div className="flex gap-1 flex-wrap">
                          {i?.beneficiaryGroupProject?.length > 0 ? (
                            i?.beneficiaryGroupProject?.map((project) => {
                              return (
                                <Badge
                                  key={project?.Project?.id}
                                  className="text-[#3D3D51] text-sm/6 font-normal"
                                >
                                  {project?.Project?.name ?? 'N/A'}
                                </Badge>
                              );
                            })
                          ) : (
                            <p className="text-sm/6 italic text-[#505868]">
                              No Projects Assigned
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full mx-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignModalClick(i);
                      }}
                      disabled={!i?._count?.groupedBeneficiaries}
                    >
                      <Plus className="mr-1" size={18} strokeWidth={1.5} />
                      Assign Project
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center mt-10 text-muted-foreground">
              No result.
            </p>
          )}
          {hasMore && <div ref={sentinelRef} className="h-1" />}
          {loadingMore && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}

export default memo(BeneficiaryGroupsView);
