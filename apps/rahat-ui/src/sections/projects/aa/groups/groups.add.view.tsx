import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import AddStakeholdersGroups from './add.stakeholders.groups';

export default function GroupsAddView() {
    return (
        <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
            <Tabs defaultValue="stakeholdersGroups" className="w-full">
                <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="stakeholdersGroups">Stakeholders Groups</TabsTrigger>
                    <TabsTrigger value="beneficiaryGroups">Beneficiary Groups</TabsTrigger>
                </TabsList>
                <TabsContent value="stakeholdersGroups"><AddStakeholdersGroups /></TabsContent>
                <TabsContent value="beneficiaryGroups">Beneficiary Groups</TabsContent>
            </Tabs>
        </div>
    )
}