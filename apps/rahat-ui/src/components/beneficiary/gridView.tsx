'use client';

import { Input } from '@rahat-ui/shadcn/components/input';
import { Search, Filter } from 'lucide-react';
import BeneficiaryCard from '../../components/beneficiary/card';
import { IBeneficiaryItem } from '../../types/beneficiary';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { ListBeneficiary } from '@rahat-ui/types';

type IProps = {
  handleClick: (item: IBeneficiaryItem) => void;
  data: ListBeneficiary[];
};

export default function GridView({ handleClick, data }: IProps) {
  return (
    <ScrollArea className="p-4 h-custom">
      <div className="flex justify-between items-center gap-2 mb-8">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8" />
        </div>
        <Filter />
      </div>
      <div className="flex flex-col gap-3">
        {data?.map((data: IBeneficiaryItem) => (
          <BeneficiaryCard
            key={data.uuid}
            walletAddress={data.walletAddress}
            updatedAt={data.updatedAt}
            handleClick={() => handleClick(data)}
            verified={false}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
