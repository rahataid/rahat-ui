'use client';

import DashboardLayout from '../dashboard/layout';

export default function VendorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
