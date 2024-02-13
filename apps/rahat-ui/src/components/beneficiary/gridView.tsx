'use client';

import { Input } from '@rahat-ui/shadcn/components/input';
import { Search, Filter } from 'lucide-react';
import BeneficiaryCard from '../../components/beneficiary/card';
import BeneficiaryData from '../../app/beneficiary/beneficiaryData.json';
import { IBeneficiaryItem } from '../../types/beneficiary';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';

type IProps = {
  handleClick: (item: IBeneficiaryItem) => void;
};

export default function GridView({ handleClick }: IProps) {
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
        {BeneficiaryData.map((data: IBeneficiaryItem) => (
          <BeneficiaryCard
            key={data.name}
            name={data.name}
            transactionNumber={data.transactionNumber}
            updatedDate={data.updatedDate}
            verified={data.verified}
            handleClick={() => handleClick(data)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
