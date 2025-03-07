import React from 'react';
import { Heading, IconLabelBtn } from 'packages/modules';
import { FundManagementTabs } from './components';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function FundManagementView() {
  const router = useRouter();
  const { id } = useParams();
  return (
    <div className="p-4">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Fund Management"
          description="Track all the fund management reports here"
        />
        <IconLabelBtn
          Icon={Plus}
          handleClick={() =>
            router.push(`/projects/aa/${id}/fund-management/add`)
          }
          name="Assign Funds"
        />
      </div>
      <FundManagementTabs />
    </div>
  );
}
