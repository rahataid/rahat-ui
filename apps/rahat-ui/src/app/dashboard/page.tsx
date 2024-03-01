'use client';

import { useAccount, useReadContract } from 'wagmi';
import {
  DashboardCharts,
  DashboardHeader,
  DashboardSummary,
} from '../../sections/dashboard';
import { abi } from './storage-abi';

export default function DashBoardPage() {
  return (
    <div className="max-h-mx">
      <DashboardHeader />
      <DashboardSummary />
      <DashboardCharts />
    </div>
  );
}
