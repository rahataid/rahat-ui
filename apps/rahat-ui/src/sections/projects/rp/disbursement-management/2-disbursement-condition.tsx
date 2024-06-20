import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import React from 'react';

const DisbursementCondition = () => {
  return (
    <div className="grid grid-cols-12 p-4">
      <div className="col-span-12 h-[calc(100vh-482px)] bg-card rounded-sm p-4">
        <div className="col-span-12">
          <h1 className="text-gray-700 text-xl font-medium">
            Select Disbursement Condition
          </h1>
          <div className="flex flex-col mt-12">
            <div className="col-span-6 flex items-center gap-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                When project receives enough token.
              </label>
            </div>
            <Separator className="my-4" />
            <div className="col-span-6 flex items-center gap-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                When disbursement approved by admin
              </label>
            </div>
            <Separator className="my-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisbursementCondition;
