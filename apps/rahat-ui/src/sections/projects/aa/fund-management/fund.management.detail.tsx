import { ArrowLeft, Text } from 'lucide-react';
import React from 'react';

const FundManagementDetails = () => {
  return (
    <div className="p-2 bg-secondary">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 mt-4 mb-4 ml-2">
        <ArrowLeft size={20} strokeWidth={1.25} />
        <h1 className="text-xl font-medium">
          Demo For Title For Fund Management (dmeo 1)
        </h1>
      </div>
      {/* DATACARD */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-4 rounded bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Text size={25} />
          </div>
          <div>
            <h1 className="font-medium">Token Value</h1>
            <p className="text-xl text-primary font-semibold">{'10,000'}</p>
          </div>
        </div>
        <div className="p-4 rounded bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Text size={25} />
          </div>
          <div>
            <h1 className="font-medium">No. of Token</h1>
            <p className="text-xl text-primary font-semibold">{'2'}</p>
          </div>
        </div>
        <div className="p-4 rounded bg-card flex items-center gap-4">
          <div className="p-3 bg-secondary text-primary rounded">
            <Text size={25} />
          </div>
          <div>
            <h1 className="font-medium">Fund Management</h1>
            <p className="text-xl text-primary font-semibold">{'20,000'}</p>
          </div>
        </div>
      </div>
      {/* PROJECT INFO */}
      <div className="col-span-4 rounded bg-card p-4 shadow mt-4">
        <div>
          <p className="font-medium">Fund Managemet</p>
        </div>
        <div className="flex items-center flex-wrap mt-2 gap-10 md:gap-32">
          <div>
            <p className="font-medium text-primary">Projet name demo</p>
            <p className="font-light">Project</p>
          </div>
          <div>
            <p className="font-medium text-primary">
              Beneficiary Group Name Demo
            </p>
            <p className="font-light">Beneficiary Group</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundManagementDetails;
