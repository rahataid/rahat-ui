import React, { FC } from 'react';
import { initialStepData } from './fund-management-flow';

interface DisbursementConfirmationProps {
  handleStepDataChange: (e: any) => void;
  stepData: typeof initialStepData;
}

const DisbursementConfirmation: FC<DisbursementConfirmationProps> = ({
  handleStepDataChange,
  stepData,
}) => {
  return (
    <div className="grid grid-cols-12 p-4">
      <div className="col-span-12 h-[calc(100vh-482px)] bg-card rounded-sm p-4">
        <h1 className="text-gray-700 text-xl font-medium">CONFIRMATION</h1>
        <div className="col-span-6">
          <div className="bg-stone-50 h-full p-3 rounded-sm mt-4">
            <div className="flex flex-col gap-8 p-3">
              <div className="flex flex-col gap-2">
                <p>Beneficiaries Selected:</p>
                <p>{stepData.selectedBeneficiaries.length}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Project Balance:</p>
                <p>400 USDC</p>
              </div>
              {stepData.bulkInputAmount ? (
                <div className="flex flex-col gap-2">
                  <p>Send Amount among Beneficiaries:</p>
                  <p>{stepData?.bulkInputAmount} USDC</p>
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <p>Total Amount to Send:</p>
                <p>
                  {stepData.selectedBeneficiaries.reduce(
                    (acc, curr) => acc + parseFloat(curr.amount),
                    0,
                  )}{' '}
                  USDC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisbursementConfirmation;
