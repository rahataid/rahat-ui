import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Users } from 'lucide-react';
import React from 'react';
import { DisburseTable } from './disburse-table';

const DisbursementPlan = () => {
  return (
    <div className="grid grid-cols-12 p-4">
      <div className="col-span-4">
        <h1 className="mb-4 text-gray-700 text-xl font-medium">
          Create Disbursement Plan
        </h1>
        <DataCard
          className=""
          title="Total beneficiaries"
          number={'12'}
          Icon={Users}
        />
      </div>
      <div className="col-span-12">
        <DisburseTable />
      </div>
    </div>
  );
};

export default DisbursementPlan;
