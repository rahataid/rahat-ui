'use client';

import * as React from 'react';
import { memo } from 'react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import BeneficiaryGroups from './beneficiaryGroups';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import BeneficiaryTable from './beneficiaryTable';
function BeneficiaryView() {
  const { activeTab, setActiveTab } = useActiveTab('beneficiary');

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
      <TabsContent value="beneficiary">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">Beneficiaries</h1>
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div>
          <h1 className="font-bold text-2xl text-label pl-4">
            Beneficiary Groups
          </h1>
        </div>
      </TabsContent>
      <p className="text-muted-foreground text-left pl-4 mb-0 pb-0">
        Overview of your humanitarian aid project
      </p>

      <div className="flex justify-between items-center p-4">
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            id="beneficiary"
            className="w-full data-[state=active]:bg-white"
            value="beneficiary"
          >
            Beneficiary
          </TabsTrigger>
          <TabsTrigger
            id="beneficiaryGroups"
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryGroups"
          >
            Beneficiary Groups
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="beneficiary">
        <div className="px-4">
          <BeneficiaryTable />
        </div>
      </TabsContent>
      <TabsContent value="beneficiaryGroups">
        <div className="px-4">
          <BeneficiaryGroups />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default memo(BeneficiaryView);
