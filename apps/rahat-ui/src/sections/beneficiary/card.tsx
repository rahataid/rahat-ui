'use client';

import { FilePenLine, Trash2 } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { IBeneficiaryItem } from '../../types/beneficiary';

interface IAdditionalBeneficiaryItem extends IBeneficiaryItem {
  handleClick: VoidFunction;
}

export default function Card({
  walletAddress,
  updatedAt,
  verified,
  handleClick,
}: IAdditionalBeneficiaryItem) {
  const changedDate = new Date(updatedAt);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-5 border rounded-md cursor-pointer" onClick={handleClick}>
      <div className="flex justify-between mb-5">
        <div>
          <h1 className="font-semibold mb-2">{walletAddress}</h1>
          <p className="text-slate-500">
            Total transaction made : {Math.floor(Math.random() * 10)}{' '}
            transactions
          </p>
        </div>
        <div className="flex gap-4">
          <FilePenLine size={20} />
          <Trash2 size={20} />
        </div>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <p className="text-slate-400">Last updated: {formattedDate}</p>
        <div className="cursor-auto ">
          <Badge className="px-2 py-1.5 rounded-md">
            {verified ? 'Verified' : 'Unverified'}
          </Badge>
          {/* <Badge
            className="px-4 py-1.5 rounded-md"
            variant={!verified ? 'default' : 'secondary'}
          >
            Unverified
          </Badge> */}
        </div>
      </div>
    </div>
  );
}
