import { useTranslations } from 'next-intl';
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
  const t = useTranslations('AA Project');
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
              {t('STAKEHOLDERS_GROUPS')}
            </TabsTrigger>
            <TabsTrigger
              value="beneficiaryGroups"
              className="w-52 bg-card border data-[state=active]:border-primary"
            >
              {t('BENEFICIARY_GROUP')}s
            </TabsTrigger>
          </TabsList>
          {/* Add Groups Btn  */}
          {activeTab === 'stakeholdersGroups' && (
            <AddButton
              path={`/projects/aa/${projectId}/groups/add`}
              name={t('STAKEHOLDERS_GROUPS')}
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
