import { useFindAllDisbursementPlans } from '@rahat-ui/query';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export enum DisbursementConditionType {
  BALANCE_CHECK = 'BALANCE_CHECK',
  APPROVER_SIGNATURE = 'APPROVER_SIGNATURE',
  SCHEDULED_TIME = 'SCHEDULED_TIME',
}

interface DisbursementConditionProps {
  handleStepDataChange: (e: any) => void;
  stepData: any;
}

const DisbursementCondition = ({
  handleStepDataChange,
  stepData,
}: DisbursementConditionProps) => {
  const [selectedConditions, setSelectedConditions] = useState<
    DisbursementConditionType[]
  >([]);

  const { id } = useParams() as { id: UUID };

  const handleCheckboxChange = (condition: DisbursementConditionType) => {
    setSelectedConditions((prevSelectedConditions) => {
      const isSelected = prevSelectedConditions.includes(condition);
      const newSelectedConditions = isSelected
        ? prevSelectedConditions.filter((item) => item !== condition)
        : [...prevSelectedConditions, condition];

      handleStepDataChange({
        target: {
          name: 'selectedConditions',
          value: newSelectedConditions,
        },
      }); // Notify parent component
      return newSelectedConditions;
    });
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 h-[calc(100vh-482px)] bg-card rounded-sm p-4">
        <div className="col-span-12">
          <h1 className="text-gray-700 text-xl font-medium">
            Select Disbursement Condition
          </h1>
          <div className="flex flex-col mt-12">
            <div className="col-span-6 flex items-center gap-2">
              <Checkbox
                id="balance_check"
                checked={
                  selectedConditions.includes(
                    DisbursementConditionType.BALANCE_CHECK,
                  ) ||
                  stepData.selectedConditions.includes(
                    DisbursementConditionType.BALANCE_CHECK,
                  )
                }
                onCheckedChange={() =>
                  handleCheckboxChange(DisbursementConditionType.BALANCE_CHECK)
                }
              />
              <label
                htmlFor="balance_check"
                className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                When project receives enough token.
              </label>
            </div>
            <Separator className="my-4" />
            <div className="col-span-6 flex items-center gap-2">
              <Checkbox
                id="approver_signature"
                checked={
                  selectedConditions.includes(
                    DisbursementConditionType.APPROVER_SIGNATURE,
                  ) ||
                  stepData.selectedConditions.includes(
                    DisbursementConditionType.APPROVER_SIGNATURE,
                  )
                }
                onCheckedChange={() =>
                  handleCheckboxChange(
                    DisbursementConditionType.APPROVER_SIGNATURE,
                  )
                }
              />
              <label
                htmlFor="approver_signature"
                className="text-base font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                When disbursement approved by admin.
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
