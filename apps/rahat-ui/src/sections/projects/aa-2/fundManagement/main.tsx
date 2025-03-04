import React from 'react';
import { Heading, IconLabelBtn } from 'packages/modules';
import { FundManagementTabs } from './components';
import { Plus } from 'lucide-react';

export default function FundManagementView() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Fund Management"
          description="Track all the fund management reports here"
        />
        <IconLabelBtn Icon={Plus} handleClick={() => {}} name="Assign Funds" />
      </div>
      <FundManagementTabs />
    </div>
  );
}
