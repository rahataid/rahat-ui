import { CirclePlus, Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';

const FreeVoucherInfo = ({ data }) => {
  return (
    <div>
      <div className="mx-2 mt-2 rounded bg-card p-4 shadow">
        <div className="flex items-center justify-end">
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="font-medium text-primary">Free</p>
            <p className="font-light">Voucher Name</p>
          </div>
          <div>
            <p className="font-medium text-primary text-right">{data?.freeVoucherPrice || 0}</p>
            <p className="font-light">Value in {data?.freeVoucherCurrency || 'USD'}</p>
          </div>
          <div>
            <p className="font-medium text-primary text-right">
              {Number(data?.eyeVoucherBudget) || 0}
            </p>
            <p className="font-light">No. of Voucher Minted</p>
          </div>
        </div>
        <p className="mt-4 sm:mt-8 sm:w-2/3">{data?.freeVoucherDescription || 'Free voucher'}</p>
      </div>
      <div></div>
    </div>
  );
};

export default FreeVoucherInfo;
