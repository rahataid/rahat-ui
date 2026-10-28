import { useTranslations } from 'next-intl';
import React from 'react';
import { FundManagementTabs } from './components';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useProjectBalance } from 'apps/rahat-ui/src/hooks/aa/utils';
import { useFundAssignmentStore } from '@rahat-ui/query';
import { Can } from 'apps/rahat-ui/src/components/can';
import { ACTIONS, SUBJECTS } from 'apps/rahat-ui/src/constants/ability.constants';

export default function FundManagementView() {
  const t = useTranslations('AA_PROJECT');
  const router = useRouter();
  const { id: projectUUID } = useParams() as { id: UUID };
  const projectBalance = useProjectBalance(projectUUID);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title={t('FUND_MANAGEMENT')}
          description={t('TRACK_ALL_THE_FUND_MANAGEMENT_REPORTS')}
        />
        <Can action={ACTIONS.CREATE} subject={SUBJECTS.FUND_MANAGEMENT}>
          <IconLabelBtn
            Icon={Plus}
            handleClick={() =>
              router.push(`/projects/aa/${projectUUID}/fund-management/add`)
            }
            name={t('ASSIGN_FUNDS')}
          />
        </Can>
      </div>
      <FundManagementTabs />
    </div>
  );
}
