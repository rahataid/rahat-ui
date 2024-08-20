import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
type Step1SelectVendorProps = {
  vendor: any;
  form: UseFormReturn<z.infer<any>>;
};

export default function Step1SelectVendor({
  vendor,
  form,
}: Step1SelectVendorProps) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-lg m-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            Select Vendor
          </h1>
        </div>
        <p className="text-gray-500 font-normal text-base">
          Select the vendor from to proceed forward
        </p>
      </div>
      <div className="mt-8 mb-8">
        <Form {...form}>
          <form className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendor?.map((vendor: any) => (
                        <SelectItem
                          key={vendor?.uuid}
                          // defaultValue={vendor?.name}
                          value={vendor?.id.toString()}
                        >
                          {vendor?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
