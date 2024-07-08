import React from 'react';
import { useParams } from 'next/navigation';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import StakeholdersGroupsListView from './stakeholders/stakeholders.groups.list.view';
import BeneficiaryGroupsListView from './beneficiary/beneficiary.groups.list.view';
import AddButton from '../../components/add.btn';

export default function GroupsView() {
  const { id: projectId } = useParams();
  const [activeTab, setActiveTab] =
    React.useState<string>('stakeholdersGroups');
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      <Tabs defaultValue="stakeholdersGroups" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList className="bg-secondary gap-4">
            <TabsTrigger
              value="stakeholdersGroups"
              className="w-52 bg-card border data-[state=active]:border-primary"
            >
              Stakeholders Groups
            </TabsTrigger>
            <TabsTrigger
              value="beneficiaryGroups"
              className="w-52 bg-card border data-[state=active]:border-primary"
            >
              Beneficiary Groups
            </TabsTrigger>
          </TabsList>
          {/* Add Groups Btn  */}
          {activeTab === 'stakeholdersGroups' && (
            <AddButton
              path={`/projects/aa/${projectId}/groups/add`}
              name="Stakeholders Groups"
            />
          )}
        </div>
        <TabsContent value="stakeholdersGroups">
          <StakeholdersGroupsListView />
        </TabsContent>
        <TabsContent value="beneficiaryGroups">
          <BeneficiaryGroupsListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
