import { Button } from '@rahat-ui/shadcn/components/button';

import React, { useEffect, useState } from 'react';

import { Role } from '@rumsan/sdk/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Minus, MoreVertical, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import EditRole from './editRole';
import { useDeleteRole, useGetRole } from '@rahat-ui/community-query';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useUserCurrentUser } from '@rumsan/react-query';
import { ROLE_TYPE } from 'apps/community-tool-ui/src/constants/user.const';

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
          {/* Delete Role */}
          <Dialog>
            <DialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2
                      className="cursor-pointer"
                      size={18}
                      strokeWidth={1.6}
                      color="#FF0000"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Role</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your user.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex items-center justify-center mt-2 gap-4">
                  <Button variant="outline" onClick={() => handleDeleteRole()}>
                    Yes
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">No</Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
                    {roleDetail?.data?.role?.isSystem ? 'true' : 'false'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground ">
                    Is System
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Permission Details */}
          <Card className="shadow rounded m-2">
            <CardHeader className="mb-0 pb-0">Permission Details</CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-base">Subject</h3>
                </div>
                <div className="text-right">
                  <h3 className="font-medium text-base">Actions</h3>
                </div>
              </div>

              {roleDetail?.data?.permissions &&
                Object.keys(roleDetail?.data?.permissions).map((key) => (
                  <div
                    key={key}
                    className="grid grid-cols-2 gap-4 mt-2 text-sm"
                  >
                    <div>
                      <p className="font-light text-base">
                        {key.toUpperCase().charAt(0) + key.slice(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p key={key} className="font-light text-base">
                        {roleDetail?.data?.permissions[key]
                          .map(
                            (value) =>
                              value.charAt(0).toUpperCase() + value.slice(1),
                          )
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </>
      )}
      {/* Edit View */}
      {activeTab === 'edit' && (
        <>
          <div className="flex flex-col justify-between ">
            <div className="p-4 border-t">
              <EditRole roleDetail={roleDetail} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
