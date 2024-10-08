'use client';
import { memo, useEffect } from 'react';

import {
  useBeneficiaryGroupsList,
  useFindAllBeneficiaryGroups,
  usePagination,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { Users } from 'lucide-react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import SearchInput from '../../components/search.input';

function BeneficiaryGroupsView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
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
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, []);

  const { data: groups } = useFindAllBeneficiaryGroups(id as UUID);

  const handleFilterProjectSelect = (project: string | UUID) => {
    setFilters({
      projectId: project,
    });
  };

  const benUUIDs = Object.keys(selectedListItems);

  return (
    <>
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-4">
          <SearchInput className="w-full" name="group" onSearch={() => { }} />
          {/* <AddButton name="Group" path="/beneficiary/groups/add" /> */}
        </div>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="grid grid-cols-4 gap-4">
            {groups &&
              groups?.map((i: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="cursor-pointer rounded-md border shadow p-4"
                    onClick={() => {
                      router.push(
                        `/projects/el-kenya/${id}/beneficiary/group/${i?.uuid}`,
                      );
                    }}
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="rounded-md bg-secondary grid place-items-center h-28">
                        <div className="bg-[#667085] text-white p-2 rounded-full">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>
                      {/* <Badge className="w-min">{i?.type ?? 'N/A'}</Badge> */}
                      <p className="text-base mb-1">{i?.name ?? 'N/A'}</p>
                      <div className="flex gap-2 items-center">
                        <Users size={18} strokeWidth={2} />
                        {i?._count.groupedBeneficiaries || 0}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

export default memo(BeneficiaryGroupsView);
