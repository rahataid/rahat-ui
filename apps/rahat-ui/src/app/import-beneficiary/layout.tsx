'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <title>Import Beneficiary</title>
      {children}
    </DashboardLayout>
  );
}
