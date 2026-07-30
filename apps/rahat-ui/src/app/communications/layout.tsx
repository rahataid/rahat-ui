'use client';

import * as React from 'react';
import DASHBOARDLayout from '../dashboard/layout';
import { useNavItems } from '../../sections/communications/useNavItems';
import { CommunicationLayout } from '../../sections/communications/components';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CommunicationLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('COMMUNICATIONS_NAVIGATION');
  const pathName = usePathname();
  const menuItems = useNavItems();
  const allowedPaths = ['/communications/add'];
  return (
    <DASHBOARDLayout>
      <title>{t('COMMUNICATIONS')}</title>
      {!allowedPaths.includes(pathName) ? (
        <>{children}</>
      ) : (
        <CommunicationLayout menuItems={menuItems}>
          {children}
        </CommunicationLayout>
      )}
    </DASHBOARDLayout>
  );
}
