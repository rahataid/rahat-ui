import React from 'react';
import { FundManagementTabs } from './components';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useAbility } from 'apps/rahat-ui/src/context/AbilityContext.old';

export default function FundManagementView() {
  const router = useRouter();
  const { id: projectUUID } = useParams() as { id: UUID };
  // const projectBalance = useProjectBalance(projectUUID);
  // const projectBalance = useFundAssignmentStore(
  //   (state) => state.projectBalance,
  // );

  // Check if user can create FundManagement before showing button
  const ability = useAbility();
  const canOpenAssignFunds = ability.can('create', 'FundManagement');

  return (
    <div className="p-4">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Fund Management"
          description="Track all the fund management reports here"
        />
        {canOpenAssignFunds && (
          <IconLabelBtn
            Icon={Plus}
            handleClick={() =>
              router.push(`/projects/aa/${projectUUID}/fund-management/add`)
            }
            name="Assign Funds"
          />
        )}
      </div>
      <FundManagementTabs />
    </div>
  );
}
