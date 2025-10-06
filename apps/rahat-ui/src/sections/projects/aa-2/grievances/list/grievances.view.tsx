'use client';

import { memo } from 'react';

import { Heading } from 'apps/rahat-ui/src/common';
import GrievancesTable from './grievances.table';
function GrievancesView() {
  return (
    <div>
      <div className="p-4 pb-2">
        <Heading
          title={`Grievances`}
          description="Track all the grievances in the project"
        />
      </div>

      <div className="px-4">
        <GrievancesTable />
      </div>
    </div>
  );
}

export default memo(GrievancesView);
