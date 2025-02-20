import DashboardLayout from '../dashboard/layout';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
