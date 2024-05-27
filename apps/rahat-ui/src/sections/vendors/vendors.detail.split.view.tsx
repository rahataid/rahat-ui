'use client';

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Button } from '@rahat-ui/shadcn/components/button';
import { UUID } from 'crypto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { Minus, MoreVertical, Trash2, Copy, CopyCheck } from 'lucide-react';
import Image from 'next/image';
import { useBoolean } from '../../hooks/use-boolean';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useAssignVendorToProject, useProjectList } from '@rahat-ui/query';

type IProps = {
  vendorsDetail: any;
  closeSecondPanel: VoidFunction;
};

export default function VendorsDetailSplitView({
  vendorsDetail,
  closeSecondPanel,
}: IProps) {
  const [walletAddressCopied, setWalletAddressCopied] =
    useState<boolean>(false);
    
  const projectList = useProjectList({});

  const [selectedProject, setSelectedProject] = useState<any>();
  const addVendor = useAssignVendorToProject();
  const handleProjectChange = (d: UUID) => setSelectedProject(d);
  const projectModal = useBoolean();

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(true);
  };

  const handleAssignProject = async () => {
    if (!selectedProject) return alert('Please select a project');
    await addVendor.mutateAsync({
      vendorUUID: vendorsDetail.id,
      projectUUID: selectedProject,
    });
    projectModal.onFalse();
  };

  const assignVoucher = () => {
    projectModal.onTrue();
  }

  return (
    <>
      <div className="flex justify-between p-4 pt-5 bg-secondary border-b">
        <TooltipProvider>
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
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                className="cursor-pointer"
                size={20}
                strokeWidth={1.5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src="/profile.png"
            alt="cat"
            height={80}
            width={80}
          />
          <div>
            <h1 className="font-semibold text-xl mb-1">
              {vendorsDetail?.name}
            </h1>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex gap-3 items-center"
                  onClick={() => clickToCopy(vendorsDetail?.walletAddress)}
                >
                  <p className="text-muted-foreground text-base">
                    {truncateEthAddress(vendorsDetail?.walletAddress)}
                  </p>
                  {walletAddressCopied ? (
                    <CopyCheck size={15} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-muted-foreground"
                      size={15}
                      strokeWidth={1.5}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-secondary" side="bottom">
                  <p className="text-xs font-medium">
                    {walletAddressCopied ? 'copied' : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {vendorsDetail.projectName === 'N/A' && <Button type="button" variant="default" onClick={assignVoucher}>
          Assign to Project
        </Button>}
        </div>
        <div>
      </div>
      <Card className="shadow rounded m-2">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-light text-base">
                {vendorsDetail?.name || '-'}
              </p>
              <p className="text-sm font-normal text-muted-foreground">Name</p>
            </div>
            <div className="text-right">
              <p className="font-light text-base">
                {vendorsDetail?.gender || '-'}
              </p>
              <p className="text-sm font-normal text-muted-foreground ">
                Gender
              </p>
            </div>
            <div>
              <p className="font-light text-base">
                {vendorsDetail?.email || '-'}
              </p>
              <p className="text-sm font-normal text-muted-foreground ">
                Email
              </p>
            </div>
            <div className="text-right">
              <p className="font-light text-base">
                {vendorsDetail?.phone || '-'}
              </p>
              <p className="text-sm font-normal text-muted-foreground ">
                Phone
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Project</DialogTitle>
            <DialogDescription>
              {!selectedProject && (
                <p className="text-orange-500">Select a project to assign</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Select onValueChange={handleProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="--Select--" />
              </SelectTrigger>
              <SelectContent>
                {projectList.data?.data.length &&
                  projectList.data?.data.map((project: any) => {
                    return (
                      <SelectItem key={project.id} value={project.uuid}>
                        {project.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={handleAssignProject}
                type="button"
                variant="ghost"
                className="text-primary"
              >
                Assign
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
