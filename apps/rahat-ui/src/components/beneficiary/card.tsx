'use client';

import { FilePenLine, Trash2 } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { IBeneficiaryItem } from '../../types/beneficiary';

interface IAdditionalBeneficiaryItem extends IBeneficiaryItem {
  handleClick: VoidFunction;
}

export default function Card({
  name,
  transactionNumber,
  updatedDate,
  verified,
  handleClick,
}: IAdditionalBeneficiaryItem) {
  return (
    <div className="p-5 border rounded-md cursor-pointer" onClick={handleClick}>
      <div className="flex justify-between mb-5">
        <div>
          <h1 className="font-semibold mb-2">{name}</h1>
          <p className="text-slate-500">
            Total transaction made : {transactionNumber} transactions
          </p>
        </div>
        <div className="flex gap-4">
          <FilePenLine size={20} />
          <Trash2 size={20} />
        </div>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-slate-400">Last updated: {updatedDate}</p>
        <div className="flex gap-2 cursor-auto ">
          <Badge
            className="px-4 py-1.5 rounded-md"
            variant={verified ? 'default' : 'secondary'}
          >
            Verified
          </Badge>
          <Badge
            className="px-4 py-1.5 rounded-md"
            variant={!verified ? 'default' : 'secondary'}
          >
            Unverified
          </Badge>
        </div>
      </div>
    </div>
  );
}
