'use client';

import { useState } from 'react';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Search, Filter } from 'lucide-react';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';

import CustomPagination from '../../components/customPagination';
import BeneficiaryCard from '../../sections/beneficiary/card';
import { IBeneficiaryItem } from '../../types/beneficiary';
import { ListBeneficiary } from '@rahat-ui/types';

type IProps = {
  handleClick: (item: IBeneficiaryItem) => void;
  data: ListBeneficiary[] | [];
};

export default function GridView({ handleClick, data }: IProps) {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data?.length;
  const totalPages = Math?.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = data?.slice(startIndex, endIndex);
  const handlePaginationClick = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      <ScrollArea className="p-4 h-withPage">
        <div className="grid 2xl:grid-cols-2 gap-2 2xl:mb-8">
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
            <Filter />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {displayedItems?.length > 0 ? (
            displayedItems?.map((data: IBeneficiaryItem) => (
              <BeneficiaryCard
                key={data.uuid}
                walletAddress={data.walletAddress}
                updatedAt={data.updatedAt}
                verified={data.verified}
                handleClick={() => handleClick(data)}
              />
            ))
          ) : (
            <div className="mt-2 p-5">
              <h6 className="text-center">No Data Available</h6>
            </div>
          )}
        </div>
      </ScrollArea>
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePaginationClick={handlePaginationClick}
      />
    </>
  );
}
