'use client';
import React, { memo, useEffect } from 'react';

import { useBeneficiaryGroupsList, usePagination } from '@rahat-ui/query';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { LandmarkIcon, Plus, Users } from 'lucide-react';
import SearchInput from '../../projects/components/search.input';
import AddButton from '../../projects/components/add.btn';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRouter } from 'next/navigation';
import AssignBeneficiaryToProjectModal from './assignToProjectModal';
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';

function BeneficiaryGroupsView() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedGroup, setSelectedGroup] =
    React.useState<ListBeneficiaryGroup>([]);
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  useEffect(() => {
    setPagination({ page: 1, perPage: 100, order: 'desc', sort: 'createdAt' });
  }, []);

  const data = useBeneficiaryGroupsList({
    ...pagination,
    ...filters,
  });

  const groups = data?.data || [];

  const filteredGroups = React.useMemo(() => {
    return groups.filter((group) =>
      group.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [groups, searchTerm]);

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
          {filteredGroups.length > 0 ? (
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
                      <div className="mb-4">
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-semibold mb-1 text-[#3D3D51]">
                            {i?.name ?? 'N/A'}
                          </p>
                          {i?.isGroupValidForAA && (
                            <div>
                              <LandmarkIcon
                                strokeWidth={2}
                                className="w-4 h-4 text-green-600"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 items-center text-[#667085]">
                          <Users size={18} strokeWidth={2} />
                          {i?._count?.groupedBeneficiaries || 0} beneficiaries
                        </div>

                        {i?.groupPurpose && (
                          <Badge className="text-gray-700 font-normal text-[15px]/5">
                            {capitalizeFirstLetter(
                              i?.groupPurpose?.split('_')[0] || '',
                            )}
                          </Badge>
                        )}
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
        </ScrollArea>
      </div>
    </>
  );
}

export default memo(BeneficiaryGroupsView);
