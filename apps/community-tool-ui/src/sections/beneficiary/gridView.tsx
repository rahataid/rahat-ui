'use client';

import { Input } from '@rahat-ui/shadcn/components/input';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Search } from 'lucide-react';

import { ListBeneficiary } from '@rahat-ui/types';
import BeneficiaryCard from '../../sections/beneficiary/card';
import { IBeneficiaryItem } from '../../types/beneficiary';

type IProps = {
  handleClick: (item: IBeneficiaryItem) => void;
  data: ListBeneficiary[];
};

export default function GridView({ handleClick, data }: IProps) {
  return (
    <>
      <ScrollArea className="px-4 pt-2 h-withPage">
        <div className="grid 2xl:grid-cols-1 gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8 rounded" />
            </div>
            {/* <Filter /> */}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data?.map((data: IBeneficiaryItem) => (
            <BeneficiaryCard
              key={data?.uuid}
              walletAddress={data.walletAddress}
              updatedAt={data.updatedAt}
              verified={data.verified}
              handleClick={() => handleClick(data)}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
