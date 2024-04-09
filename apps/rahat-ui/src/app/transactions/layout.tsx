'use client';

import DashboardLayout from '../dashboard/layout';

export default function TransactionsLayout({
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
