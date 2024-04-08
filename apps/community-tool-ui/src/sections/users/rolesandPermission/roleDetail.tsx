import { Button } from '@rahat-ui/shadcn/components/button';

import React, { useState } from 'react';

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
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import EditRole from './editRole';

type IProps = {
  roleDetail: Role;
  closeSecondPanel: VoidFunction;
};

export default function RoleDetail({ roleDetail, closeSecondPanel }: IProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  const changedDate = new Date(roleDetail.createdAt as Date);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
                    <p>Delete User</p>
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
                  <Button variant="outline">Yes</Button>
                  <DialogClose asChild>
                    <Button variant="outline">No</Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Actions  */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                className="cursor-pointer"
                size={20}
                strokeWidth={1.5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleTabChange('details')}>
                Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Details View */}
      {activeTab === 'details' && (
        <Card className="shadow rounded m-2">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-light text-base">{roleDetail.name}</p>
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
                  {roleDetail.createdBy ?? 'N/A'}
                </p>
                <p className="text-sm font-normal text-muted-foreground">
                  Created By
                </p>
              </div>

              <div className="text-right">
                <p className="font-light text-base">
                  {roleDetail.isSystem ? 'true' : 'false'}
                </p>
                <p className="text-sm font-normal text-muted-foreground ">
                  Is System
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
