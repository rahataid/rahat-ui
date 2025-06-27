'use client';

import React, { useState } from 'react';
import { Button } from '@rahat-ui/shadcn/components/button';
import { UUID } from 'crypto';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import {
  Trash2,
  Copy,
  CopyCheck,
  X,
  Pencil,
  FolderPlus,
  Expand,
  FolderDot,
  Wallet,
  Phone,
  Mail,
} from 'lucide-react';
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
import {
  useAssignVendorToProject,
  useProjectList,
  useRemoveVendor,
} from '@rahat-ui/query';
import TooltipComponent from '../../components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useRouter } from 'next/navigation';
import DeleteButton from '../../components/delete.btn';
import { toast } from 'react-toastify';

type IProps = {
  vendorsDetail: any;
  closeSecondPanel: VoidFunction;
};

export default function VendorsDetailSplitView({
  vendorsDetail,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  const [walletAddressCopied, setWalletAddressCopied] =
    useState<boolean>(false);
  const isVendorAssigned = React.useMemo(
    () => vendorsDetail?.status === 'Assigned',
    [vendorsDetail],
  );

  const projectList = useProjectList({});

  const [selectedProject, setSelectedProject] = useState<any>();
  const addVendor = useAssignVendorToProject();
  const handleProjectChange = (d: UUID) => setSelectedProject(d);
  const projectModal = useBoolean();

  const removeVendor = useRemoveVendor();

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
  };

  const deleteVendor = async () => {
    if (isVendorAssigned)
      return toast.warning('Assigned vendor cannot be deleted.');

    await removeVendor.mutateAsync({ vendorId: vendorsDetail.id });
    closeSecondPanel();
  };

  return (
    <div className="h-full border-l">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-4">
          <DeleteButton
            className={`border-none p-0 shadow-none ${
              isVendorAssigned ? 'hidden' : ''
            }`}
            name="vendor"
            handleContinueClick={deleteVendor}
          />

          <TooltipComponent
            handleOnClick={() =>
              router.push(`/vendors/${vendorsDetail?.id}/edit`)
            }
            Icon={Pencil}
            tip="Edit"
          />
          {vendorsDetail?.projectName === 'N/A' && (
            <TooltipComponent
              handleOnClick={assignVoucher}
              Icon={FolderPlus}
              tip="Assign Project"
            />
          )}
          <TooltipComponent
            handleOnClick={() => router.push(`/vendors/${vendorsDetail?.id}`)}
            Icon={Expand}
            tip="Expand"
          />
        </div>
        <TooltipComponent
          handleOnClick={closeSecondPanel}
          Icon={X}
          tip="Close"
        />
      </div>
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src="/profile.png"
            alt="profile"
            height={80}
            width={80}
          />
          <div>
            <h1 className="font-semibold text-xl mb-1">
              {vendorsDetail?.name}
            </h1>
            <div className="flex space-x-4 items-center">
              <Badge>{vendorsDetail?.status ?? 'N/A'}</Badge>
              <p className="text-base text-muted-foreground">
                {vendorsDetail?.gender ?? 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col space-y-4">
        <h1 className="font-medium">General</h1>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <FolderDot size={20} strokeWidth={1.5} />
            <p>Project Name</p>
          </div>
          <p className="text-muted-foreground text-base">
            {vendorsDetail?.projectName || '-'}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Wallet size={20} strokeWidth={1.5} />
            <p>Wallet Address</p>
          </div>
          <div
            className="flex space-x-3 items-center"
            onClick={() => clickToCopy(vendorsDetail?.walletAddress)}
          >
            <p className="text-muted-foreground text-base">
              {truncateEthAddress(vendorsDetail?.walletAddress) ?? '-'}
            </p>
            {vendorsDetail?.walletAddress &&
              (walletAddressCopied ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy
                  className="text-muted-foreground"
                  size={15}
                  strokeWidth={1.5}
                />
              ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Phone size={20} strokeWidth={1.5} />
            <p>Phone Number</p>
          </div>
          <p className="text-muted-foreground text-base">
            {vendorsDetail?.phone || '-'}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Mail size={20} strokeWidth={1.5} />
            <p>Email Address</p>
          </div>
          <p className="text-muted-foreground text-base">
            {vendorsDetail?.email || '-'}
          </p>
        </div>
      </div>

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
                {projectList.data?.data.length ? (
                  projectList.data?.data.map((project: any) => {
                    return (
                      <SelectItem key={project.id} value={project.uuid}>
                        {project?.name}
                      </SelectItem>
                    );
                  })
                ) : (
                  <p className="text-xs">No project found</p>
                )}
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
    </div>
  );
}
