'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import React from 'react';
import BeneficiaryGroup from './beneficiary.group';
import BeneficiaryTable from './beneficiary.table';

export default function BeneficiaryView() {
  const [activeTab, setActiveTab] = React.useState<string>('beneficiary');
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-25px)]">
      <Tabs defaultValue="beneficiary" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="bg-secondary gap-4">
            <TabsTrigger
              value="beneficiary"
              className="w-52 bg-card border data-[state=active]:border-primary"
            >
              Beneficiary
            </TabsTrigger>
            <TabsTrigger
              value="beneficiaryGroups"
              className="w-52 bg-card border data-[state=active]:border-primary"
            >
              Beneficiary Groups
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="beneficiary">
          <BeneficiaryTable />
        </TabsContent>
        <TabsContent value="beneficiaryGroups">
          <BeneficiaryGroup />
        </TabsContent>
      </Tabs>
    </div>
  );
}
