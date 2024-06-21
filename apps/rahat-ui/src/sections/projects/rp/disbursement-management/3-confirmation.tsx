import React from 'react';

const DisbursementConfirmation = () => {
  return (
    <div className="grid grid-cols-12 p-4">
      <div className="col-span-12 h-[calc(100vh-482px)] bg-card rounded-sm p-4">
        <h1 className="text-gray-700 text-xl font-medium">CONFIRMATION</h1>
        <div className="col-span-6">
          <div className="bg-stone-50 h-full p-3 rounded-sm mt-4">
            <div className="flex flex-col gap-8 p-3">
              <div className="flex flex-col gap-2">
                <p>Beneficiaries Selected:</p>
                <p>4</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Project Balance:</p>
                <p>400 USDC</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Send Amount among Beneficiaries::</p>
                <p>100 USDC</p>
              </div>
              <div className="flex flex-col gap-2">
                <p>Total Amount to Send:</p>
                <p>400 USDC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisbursementConfirmation;
