import React from 'react';
import { ScrollArea } from '../../../../../libs/shadcn/src/components/ui/scroll-area';
import CommonCard from '../../../common/card';
import { UUID } from 'crypto';
import { Search, Users } from 'lucide-react';
import { Badge } from '../../../../../libs/shadcn/src/components/ui/badge';
import NoResult from '../../../common/noResults';
import { usePagination } from '../.../../../../../../libs/query/src';
import {
  ClientSidePagination,
  CustomPagination,
  SearchInput,
} from '../../../common';

const filteredGroups = [
  {
    address: 'e8cf1e3c-460d-41f1-9f85-d56adf9578cd',
    title: 'Title 1',
    name: 'Subtitle 1',
    image: '',
    badge: 'New',
    status: 'Active',
  },
  {
    address: 'b72d1f17-7bfa-49d4-9e80-cd96b0cd0897',
    title: 'Title 2',
    name: 'Subtitle 2',
    image: '',
    badge: 'Featured',
    status: 'Inactive',
  },
  {
    address: '7d038dc6-bf10-4f0f-95d2-396e38ec3b94',
    title: 'Title 3',
    name: 'Subtitle 3',
    image: '',
    badge: 'Trending',
    status: 'Active',
  },
  {
    address: '50b4b7b5-65fa-45c4-b4b5-cbb9a788d7a6',
    title: 'Title 4',
    name: 'Subtitle 4',
    image: '',
    badge: 'Limited',
    status: 'Inactive',
  },
  {
    address: 'e8cf1e3c-460d-41f1-9f85-d56adf9578cd',
    title: 'Title 1',
    name: 'Subtitle 1',
    image: '',
    badge: 'New',
    status: 'Active',
  },
  {
    address: 'b72d1f17-7bfa-49d4-9e80-cd96b0cd0897',
    title: 'Title 2',
    name: 'Subtitle 2',
    image: '',
    badge: 'Featured',
    status: 'Inactive',
  },
  {
    address: '7d038dc6-bf10-4f0f-95d2-396e38ec3b94',
    title: 'Title 3',
    name: 'Subtitle 3',
    image: '',
    badge: 'Trending',
    status: 'Active',
  },
  {
    address: '50b4b7b5-65fa-45c4-b4b5-cbb9a788d7a6',
    title: 'Title 4',
    name: 'Subtitle 4',
    image: '',
    badge: 'Limited',
    status: 'Inactive',
  },
  {
    address: 'e8cf1e3c-460d-41f1-9f85-d56adf9578cd',
    title: 'Title 1',
    name: 'Subtitle 1',
    image: '',
    badge: 'New',
    status: 'Active',
  },
  {
    address: 'b72d1f17-7bfa-49d4-9e80-cd96b0cd0897',
    title: 'Title 2',
    name: 'Subtitle 2',
    image: '',
    badge: 'Featured',
    status: 'Inactive',
  },
  {
    address: '7d038dc6-bf10-4f0f-95d2-396e38ec3b94',
    title: 'Title 3',
    name: 'Subtitle 3',
    image: '',
    badge: 'Trending',
    status: 'Active',
  },
  {
    address: '50b4b7b5-65fa-45c4-b4b5-cbb9a788d7a6',
    title: 'Title 4',
    name: 'Subtitle 4',
    image: '',
    badge: 'Limited',
    status: 'Inactive',
  },
];
const BeneficiaryGroups = () => {
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();

  const handleSearch = (e) => {
    console.log(e);
  };
  return (
    <>
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-4">
          <SearchInput
            className="w-full"
            name="group"
            onSearch={(e) => handleSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[calc(100vh-360px)] mb-2">
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredGroups?.map((i: any, index: number) => {
                return (
                  <div key={index} className="rounded-md border shadow p-4">
                    <div className="flex flex-col space-y-2">
                      <div
                        className="cursor-pointer rounded-md bg-secondary grid place-items-center h-28"
                        // onClick={() => {
                        //   router.push(
                        //     `/beneficiary/groups/${i?.uuid}?isAssignedToProject=${isAssignedToProject}`,
                        //   );
                        // }}
                      >
                        <div className="bg-[#667085] text-white p-2 rounded-full">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>

                      <p className="text-base mb-1">{i?.name ?? 'N/A'}</p>
                      <div className="flex gap-2 items-center">
                        <Users size={18} strokeWidth={2} />
                        {i?._count?.groupedBeneficiaries || 0}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoResult />
          )}
        </ScrollArea>

        <CustomPagination
          meta={{ total: 0, currentPage: 0 }}
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
};

export default BeneficiaryGroups;
