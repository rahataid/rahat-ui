'use client';
import React, { memo, useEffect } from 'react';

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
import AddButton from '../../components/add.btn';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

type IProps = {
  projectClosed: boolean;
};

function BeneficiaryGroupsView({ projectClosed }: IProps) {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState<string>('');
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

  const {
    data: groups,
    meta,
    isLoading,
  } = useFindAllBeneficiaryGroups(id as UUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });

  const handleFilterProjectSelect = (project: string | UUID) => {
    setFilters({
      projectId: project,
    });
  };

  const benUUIDs = Object.keys(selectedListItems);

  return (
    <>
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-2">
          <SearchInput
            className="w-full"
            name="group"
            onSearch={(e) =>
              setFilters({
                name: e.target.value,
              })
            }
          />
          <AddButton
            name="Group"
            path={`/projects/el-kenya/${id}/beneficiary/group/add`}
            disabled={projectClosed}
          />
        </div>
        <ScrollArea className="h-[calc(100vh-230px)]">
          {isLoading ? (
            <TableLoader />
          ) : groups?.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {groups?.map((i: any, index: number) => {
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
          ) : (
            <p className="text-center mt-10 text-muted-foreground">
              No result.
            </p>
          )}
        </ScrollArea>
        {/* pagination  */}
        <CustomPagination
          meta={meta || { total: 0, currentPage: 0 }}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={0}
        />
      </div>
    </>
  );
}

export default memo(BeneficiaryGroupsView);
