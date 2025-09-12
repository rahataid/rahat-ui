'use client';
import { useChainSettings } from '@rahat-ui/query';
import { DashboardView } from '../../sections/dashboard';
import DashboardMain from '../../sections/dashboard/dashboard.main.temp';

export default function DashBoardPage() {
  // return <DashboardView />
  useChainSettings();
  return (
    // <div className="max-h-mx">
    <DashboardMain />
    // </div>
  );
}
