import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
import CreateDisbursementSelectionType from './createDisbursementSelectionType';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { DisbursementList } from './disbursementList';
import { usePendingDisbursements } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function DisbursementMainView() {
  const projectUUID = useParams().id as UUID;
  const { activeTab, setActiveTab } = useActiveTab('createDisbursement');
  const { data } = usePendingDisbursements(projectUUID);

  return (
    <div className="p-4 bg-gray-50 h-[calc(100vh-58px)]">
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
      >
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
              className="w-full data-[state=active]:bg-white flex gap-1 items-center"
              value="disbursementPending"
            >
              <p>Pending</p>
              <p className="bg-red-600 text-white w-5 rounded-full ">
                {data || 5}
              </p>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="createDisbursement">
          <CreateDisbursementSelectionType setActiveTab={setActiveTab} />
        </TabsContent>
        <TabsContent value="disbursementHistory">
          <DisbursementList status="" />
        </TabsContent>
        <TabsContent value="disbursementPending">
          <DisbursementList status="DRAFT" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
