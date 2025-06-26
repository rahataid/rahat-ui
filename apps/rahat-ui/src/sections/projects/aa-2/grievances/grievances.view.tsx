'use client';

import { memo } from 'react';

import { useParams } from 'next/navigation';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import GrievancesTable from './grievances.table';
function GrievancesView() {
  const { activeTab, setActiveTab } = useActiveTab('beneficiary');

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="beneficiary">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">Grievances</h1>
        </div>
      </TabsContent>

      <p className="text-muted-foreground text-left pl-4 mb-0 pb-0">
        Track all the grievances in the project
      </p>

      <div className="px-4">
        <GrievancesTable />
      </div>
    </Tabs>
  );
}

export default memo(GrievancesView);
