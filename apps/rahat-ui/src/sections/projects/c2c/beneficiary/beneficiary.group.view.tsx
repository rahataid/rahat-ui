'use client';

import { UUID } from 'crypto';
import { Users } from 'lucide-react';
import React, { memo, useEffect } from 'react';
import AddButton from '../../components/add.btn';
import { useParams, useRouter } from 'next/navigation';
import SearchInput from '../../components/search.input';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import {
  useFindAllBeneficiaryGroups,
  useFindC2CBeneficiaryGroups,
  usePagination,
} from '@rahat-ui/query';

function BeneficiaryGroupsView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const {
    pagination,
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
  } = useFindC2CBeneficiaryGroups(id as UUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });

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
            path={`/projects/c2c/${id}/beneficiary/group/add`}
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
                        `/projects/c2c/${id}/beneficiary/group/${i?.uuid}`,
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
