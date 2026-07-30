'use client';

import * as React from 'react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import CommunityBeneficiaryLayout from '../../sections/community-beneficiary/community.beneficiary.layout';
import { useCommunityBeneficiaryNavItems } from '../../sections/community-beneficiary/useNavItems';
import DASHBOARDLayout from '../dashboard/layout';
import { useTranslations } from 'next-intl';

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('COMMUNITY_BENEFICIARY_LIST');
  const menuItems = useCommunityBeneficiaryNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DASHBOARDLayout>
      <title>{t('IMPORT_GROUP_FROM_COMMUNITY_TOOL')}</title>
      <CommunityBeneficiaryLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </CommunityBeneficiaryLayout>
    </DASHBOARDLayout>
  );
}
