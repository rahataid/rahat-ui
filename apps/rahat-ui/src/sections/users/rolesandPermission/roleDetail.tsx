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
import { useUserCurrentUser } from '@rumsan/react-query';
import { Role } from '@rumsan/sdk/types';
import { X } from 'lucide-react';
import EditRole from './editRole';
import ViewPermissions from './ViewPermissions';
import { ROLE_TYPE } from '../role/const';
import DeleteButton from 'apps/rahat-ui/src/components/delete.btn';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import Swal from 'sweetalert2';

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
    if (roleDetail?.data?.role?.isSystem)
      return Swal.fire('System roles cannot be deleted', '', 'warning');
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
    <div className="border-l h-screen flex flex-col">
      <div className="flex justify-between items-center p-4 border-b shrink-0">
        <div className="flex space-x-4">
          <TooltipComponent
            handleOnClick={closeSecondPanel}
            Icon={X}
            tip="Close"
          />
          <DeleteButton
            className="border-none p-0 shadow-none"
            name="role"
            handleContinueClick={handleDeleteRole}
          />
        </div>
        <div className="flex gap-3">
          <Tabs defaultValue="details">
            <TabsList className="w-full grid grid-cols-2 bg-transparent">
              <TabsTrigger
                onClick={() => handleTabChange('details')}
                value="details"
              >
                Details
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  onClick={() => handleTabChange('edit')}
                  value="edit"
                >
                  Edit
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>
      </div>
      {/* Details View */}
      {activeTab === 'details' && (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Role Details */}
          <Card className="shadow rounded m-2">
            <CardHeader className="mb-0 pb-0 font-semibold">
              Role Details
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-base">
                    {roleDetail?.data?.role?.name}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Name
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-base">{formattedDate}</p>
                  <p className="text-sm font-normal text-muted-foreground ">
                    CreatedAt
                  </p>
                </div>

                <div>
                  <p className="font-medium text-base">
                    {roleDetail?.data?.role?.createdBy ?? 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Created By
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-medium text-base">
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
            <CardHeader className="mb-0 pb-0 font-semibold">
              Assigned Permissions
            </CardHeader>
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
        </div>
      )}
      {/* Edit View */}
      {activeTab === 'edit' && permissions && (
        <EditRole currentPerms={permissions} roleDetail={roleDetail} />
      )}
    </div>
  );
}
