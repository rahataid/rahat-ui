'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';

export default function CommunicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardLayout >
      <div className="mx-2">{children}</div>
      </DashboardLayout>
    </>
  );
}
