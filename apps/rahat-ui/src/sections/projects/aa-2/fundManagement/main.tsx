import { useTranslations } from 'next-intl';
import React from 'react';
import { FundManagementTabs } from './components';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { UUID } from 'crypto';
import { useProjectBalance } from 'apps/rahat-ui/src/hooks/aa/utils';
import { useFundAssignmentStore } from '@rahat-ui/query';

export default function FundManagementView() {
  const t = useTranslations('AA_PROJECT');
  const router = useRouter();
  const { id: projectUUID } = useParams() as { id: UUID };
  const projectBalance = useProjectBalance(projectUUID);
  // const projectBalance = useFundAssignmentStore(
  //   (state) => state.projectBalance,
  // );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title={t('FUND_MANAGEMENT')}
          description={t('TRACK_ALL_THE_FUND_MANAGEMENT_REPORTS')}
        />
        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.Municipality]}
          hasContent={false}
        >
          <IconLabelBtn
            Icon={Plus}
            handleClick={() =>
              router.push(`/projects/aa/${projectUUID}/fund-management/add`)
            }
            name={t('ASSIGN_FUNDS')}
          />
        </RoleAuth>
      </div>
      <FundManagementTabs />
    </div>
  );
}
