import React from 'react';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import BeneficiaryCard from './select.beneficiary.card';
import { useFindAllBeneficiaryGroups } from '@rahat-ui/query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const BeneficiaryGroup = () => {
  const { id } = useParams();
  const { data: benificiaryGroups } = useFindAllBeneficiaryGroups(id as UUID);

  return (
    <div>
      <p className="text-gray-500 font-normal text-base">
        Here is the list of all the beneficiaries group
      </p>
      <div className="flex flex-col justify-between  gap-2 py-4">
        <Input placeholder="Search Beneficiaries" className="rounded-md" />
        <ScrollArea className="h-[calc(100vh-498px)]">
          <div className="grid grid-cols-4 gap-4 m-4">
            {benificiaryGroups?.length > 0 ? benificiaryGroups.map((group: any) => {
              return (
                <BeneficiaryCard
                  name={group.name}
                  uuid={group.uuid}
                  totalBeneficiary={group._count.groupedBeneficiaries}
                />
              );
            }) :
            <>
             <p className="text-medium text-base mb-1">
                                No Data Available
            </p>
            </>
          
          }
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default BeneficiaryGroup;
