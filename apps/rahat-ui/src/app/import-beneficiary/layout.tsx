'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import { useTranslations } from 'next-intl';

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Import Beneficiary List');
  return (
    <DashboardLayout>
      <title>{t('IMPORT_BENEFICIARY')}</title>
      {children}
    </DashboardLayout>
  );
}
