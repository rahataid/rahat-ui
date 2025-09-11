import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
import CreateDisbursementSelectionType from './createDisbursementSelectionType';
import { DisbursementHistoryList } from './disbursementHistory';
import { DisbursementPendingList } from './disbursementPending';

export default function DisbursementMainView() {
  const [activeTab, setActiveTab] =
    React.useState<string>('createDisbursement');

  return (
    <div className="p-4 bg-gray-50 h-[calc(100vh-58px)]">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsContent className="mt-0" value="createDisbursement">
          <Heading
            title="Disbursement Management"
            description="Manage bulk disbursement to beneficiary groups"
          />
        </TabsContent>
        <TabsContent className="mt-0" value="disbursementHistory">
          <Heading
            title="Disbursement History"
            description="Track all the disbursement history"
          />
        </TabsContent>
        <TabsContent className="mt-0" value="disbursementPending">
          <Heading
            title="Disbursement History"
            description="Track all the pending disbursement history"
          />
        </TabsContent>

        <div className="flex justify-between items-center">
          <TabsList className="border bg-secondary rounded">
            <TabsTrigger
              id="createDisbursement"
              className="w-full data-[state=active]:bg-white"
              value="createDisbursement"
            >
              Create Disbursement
            </TabsTrigger>
            <TabsTrigger
              id="disbursementHistory"
              className="w-full data-[state=active]:bg-white"
              value="disbursementHistory"
            >
              Disbursement History
            </TabsTrigger>
            <TabsTrigger
              id="disbursementPending"
              className="w-full data-[state=active]:bg-white"
              value="disbursementPending"
            >
              Pending
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="createDisbursement">
          <CreateDisbursementSelectionType />
        </TabsContent>
        <TabsContent value="disbursementHistory">
          <DisbursementHistoryList />
        </TabsContent>
        <TabsContent value="disbursementPending">
          <DisbursementPendingList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
