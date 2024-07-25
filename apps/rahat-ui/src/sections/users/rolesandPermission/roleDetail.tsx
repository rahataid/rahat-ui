import { useEffect, useState } from 'react';

import { useDeleteRole, useGetRole } from '@rahat-ui/community-query';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useUserCurrentUser } from '@rumsan/react-query';
import { Role } from '@rumsan/sdk/types';
// import { ROLE_TYPE } from 'apps/community-tool-ui/src/constants/user.const';
import { Minus } from 'lucide-react';
import EditRole from './editRole';
import ViewPermissions from './ViewPermissions';
import { ROLE_TYPE } from '../role/const';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

type IProps = {
  roleData: Role;
  closeSecondPanel: VoidFunction;
};

export default function RoleDetail({ roleData, closeSecondPanel }: IProps) {
  const { data: roleDetail } = useGetRole(roleData.name);
  const { data: currentUser } = useUserCurrentUser();
  const deleteRole = useDeleteRole();

  const isAdmin = currentUser?.data?.roles.includes(ROLE_TYPE.ADMIN);
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  const changedDate = new Date(roleDetail?.data?.role?.createdAt as Date);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDeleteRole = async () => {
    await deleteRole.mutateAsync({
      name: roleDetail?.data?.role?.name as string,
    });
  };

  useEffect(() => {
    if (deleteRole.data?.response.success) {
      closeSecondPanel();
    }
  }, [closeSecondPanel, deleteRole.data?.response.success]);

  const permissions = roleDetail?.data?.permissions || null;

  return (
    <>
      <div className="flex justify-between items-center p-4 pt-5">
        {/* Minimize  */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={closeSecondPanel}>
              <Minus size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-3">
          <TabsList className="w-full grid grid-cols-2 bg-transparent">
            <TabsTrigger
              onClick={() => handleTabChange('details')}
              value="details"
            >
              Details
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger onClick={() => handleTabChange('edit')} value="edit">
                Edit
              </TabsTrigger>
            )}
          </TabsList>
        </div>
      </div>
      {/* Details View */}
      {activeTab === 'details' && (
        <>
          {/* Role Details */}
          <Card className="shadow rounded m-2">
            <CardHeader className="mb-0 pb-0">Role Details</CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-light text-base">
                    {roleDetail?.data?.role?.name}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Name
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-light text-base">{formattedDate}</p>
                  <p className="text-sm font-normal text-muted-foreground ">
                    CreatedAt
                  </p>
                </div>

                <div>
                  <p className="font-light text-base">
                    {roleDetail?.data?.role?.createdBy ?? 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Created By
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-light text-base">
                    {roleDetail?.data?.role?.isSystem ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground ">
                    Is System
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow rounded m-2">
            <CardHeader className="mb-0 pb-0">Assigned Permissions</CardHeader>
            <CardContent className="pt-1">
              {permissions &&
                Object.keys(permissions).map((subject) => (
                  <ViewPermissions
                    key={subject}
                    subject={subject}
                    existingActions={
                      permissions && permissions[subject]
                        ? permissions[subject]
                        : []
                    }
                  />
                ))}
            </CardContent>
          </Card>
        </>
      )}
      {/* Edit View */}
      {activeTab === 'edit' && permissions && (
        <>
          <ScrollArea className="h-[calc(100vh-150px)]">
            <div className="flex flex-col justify-between  ">
              <div className="p-4 border-t ">
                <EditRole currentPerms={permissions} roleDetail={roleDetail} />
              </div>
            </div>
          </ScrollArea>
        </>
      )}
    </>
  );
}
