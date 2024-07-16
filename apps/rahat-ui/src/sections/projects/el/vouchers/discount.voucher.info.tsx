import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { CirclePlus, Ellipsis } from 'lucide-react';
import React from 'react';

const DiscountVoucherInfo = ({ data }) => {
  return (
    <div className="mx-2 mt-2 rounded bg-card p-4 shadow">
      <div className="flex items-center justify-end">
      </div>
      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="font-medium text-primary">Discount</p>
          <p className="font-light">Voucher Name</p>
        </div>
        <div>
          <p className="font-medium text-primary text-right">
            {data?.referredVoucherPrice || 0}
          </p>
          <p className="font-light">
            Value in {data?.referredVoucherCurrency || ''}
          </p>
        </div>
        <div>
          <p className="font-medium text-primary text-right">
            {Number(data?.referredVoucherBudget) || 0}
          </p>
          <p className="font-light">No. of Voucher Minted</p>
        </div>
      </div>
      <div>
        <p className="mt-4 sm:mt-8 sm:w-2/3">
          {data?.referredVoucherDescription || 'Discount voucher'}
        </p>
      </div>
    </div>
  );
};

export default DiscountVoucherInfo;
