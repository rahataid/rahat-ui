'use client';

import { useCommunityBeneficiaryStatsList } from '@rahat-ui/community-query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { LucideShipWheel } from 'lucide-react';
import HouseHoldHeadInsights from './houseHoldHeadInsights';
import HouseHoldInsights from './houseHoldInsights';
import PopulationInsights from './populatioInsights';

export default function DashboardView() {
  const { data } = useCommunityBeneficiaryStatsList();

  if (!data)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LucideShipWheel className="animate-spin" size={24} />
      </div>
    );

  return (
    <div>
      <ScrollArea className="h-[calc(100vh-68px)] px-4 py-2">
        <PopulationInsights data={data} />
        <HouseHoldInsights data={data} />
        <HouseHoldHeadInsights data={data} />
      </ScrollArea>
    </div>
  );
}
