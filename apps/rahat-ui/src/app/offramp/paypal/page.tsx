import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import Paypal from 'apps/rahat-ui/src/sections/offramp/paypal';
import { Wallet } from 'lucide-react';

const page = () => {
  return (
    <div className="mx-4">
      <div className="mb-4 mt-4 ml-2">
        <h1 className="font-semibold text-[24px] leading-[38px] tracking-[-0.02em] text-[#101828]">
          Details
        </h1>
        <p className="font-normal text-[16px] leading-[24px] text-[#667085]">
          Fill the details below
        </p>
      </div>
      <Paypal />
      {/* FORM SECTION */}
    </div>
  );
};

export default page;
