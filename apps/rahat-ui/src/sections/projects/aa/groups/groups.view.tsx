import { useParams } from 'next/navigation';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import StakeholdersGroupsListView from './stakeholders/stakeholders.groups.list.view';
import AddButton from '../../components/add.btn';

export default function GroupsView() {
  const { id: projectId } = useParams();
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      <Tabs defaultValue="stakeholdersGroups">
        <div className='flex justify-between items-center'>
          <TabsList className='bg-secondary gap-4'>
            <TabsTrigger value="stakeholdersGroups" className='w-52 bg-card border data-[state=active]:border-primary'>
              Stakeholders Groups
            </TabsTrigger>
            <TabsTrigger value="beneficiaryGroups" className='w-52 bg-card border data-[state=active]:border-primary'>
              Beneficiary Groups
            </TabsTrigger>
          </TabsList>
          {/* Add Groups Btn  */}
          <AddButton path={`/projects/aa/${projectId}/groups/add`} name='Groups' />
        </div>
        <TabsContent value="stakeholdersGroups">
          <StakeholdersGroupsListView />
        </TabsContent>
        <TabsContent value="beneficiaryGroups">
          Beneficiary Groups List
        </TabsContent>
      </Tabs>
    </div>
  );
}
