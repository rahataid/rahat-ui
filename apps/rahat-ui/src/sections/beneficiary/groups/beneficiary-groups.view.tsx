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
          <AddButton name="Group" path="/beneficiary/groups/add" />
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredGroups?.map((i: any, index: number) => {
                const isAssignedToProject = i?.beneficiaryGroupProject?.length;

                return (
                  <div key={index} className="rounded-md border shadow p-4">
                    <div className="flex flex-col space-y-2">
                      <div
                        className="relative cursor-pointer rounded-md bg-secondary grid place-items-center h-28"
                        onClick={() => {
                          router.push(
                            `/beneficiary/groups/${i?.uuid}?isAssignedToProject=${isAssignedToProject}`,
                          );
                        }}
                      >
                        {i?.isGroupValidForAA && (
                          <div className="absolute top-2 right-2">
                            <LandmarkIcon
                              strokeWidth={2}
                              className="w-4 h-4 text-green-700"
                            />
                          </div>
                        )}
                        <div className="bg-[#667085] text-white p-2 rounded-full">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="flex">
                        {i?.beneficiaryGroupProject?.map((project) => {
                          return (
                            <Badge key={project?.Project?.id}>
                              {project?.Project?.name ?? 'N/A'}
                            </Badge>
                          );
                        })}
                      </div>

                      <p className="text-base mb-1">{i?.name ?? 'N/A'}</p>
                      <div className="flex gap-2 items-center">
                        <Users size={18} strokeWidth={2} />
                        {i?._count?.groupedBeneficiaries || 0}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleAssignModalClick(i)}
                        // disabled={isAssignedToProject}
                      >
                        <Plus className="mr-1" size={18} strokeWidth={1.5} />
                        Assign Project
                      </Button>
                    </div>
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
