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
import {
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
  Calendar,
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
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useTranslations } from 'next-intl';

type IProps = {
  vendorsDetail: any;
  closeSecondPanel: VoidFunction;
};

export default function VendorsDetailSplitView({
  vendorsDetail,
  closeSecondPanel,
}: IProps) {
  const t = useTranslations('VENDORS_DETAIL_SPLIT_VIEW');
  const g = useTranslations('GLOBAL');
  const router = useRouter();
  const [walletAddressCopied, setWalletAddressCopied] =
    useState<boolean>(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
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
    if (!selectedProject) return alert(t('PLEASE_SELECT_A_PROJECT'));
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
      return toast.warning(t('ASSIGNED_VENDOR_CANNOT_BE_DELETED'));

    await removeVendor.mutateAsync({ vendorId: vendorsDetail.id });
    closeSecondPanel();
  };
  const formattedDate =
    vendorsDetail?.createdAt &&
    !isNaN(new Date(vendorsDetail.createdAt).getTime())
      ? new Intl.DateTimeFormat('en-NP', {
          timeZone: 'Asia/Kathmandu',
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(new Date(vendorsDetail.createdAt))
      : 'N/A';

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

          {vendorsDetail?.projectName === 'N/A' && (
            <TooltipComponent
              handleOnClick={assignVoucher}
              Icon={FolderPlus}
              tip={t('SELECT_A_PROJECT_TO_ASSIGN')}
            />
          )}
          <TooltipComponent
            handleOnClick={() => router.push(`/vendors/${vendorsDetail?.id}`)}
            Icon={Expand}
            tip={g('EXPAND')}
          />
        </div>
        <TooltipComponent
          handleOnClick={closeSecondPanel}
          Icon={X}
          tip={g('CLOSE')}
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
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="p-4 flex flex-col space-y-4">
          <h1 className="font-medium">{g('GENERAL')}</h1>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <FolderDot size={20} strokeWidth={1.5} />
              <p>{g('PROJECT_NAME')}</p>
            </div>
            {Array.isArray(vendorsDetail?.projectName) &&
            vendorsDetail.projectName.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-w-[200px] justify-end">
                {(showAllProjects
                  ? vendorsDetail.projectName
                  : vendorsDetail.projectName.slice(0, 2)
                ).map((item: any, index: number) => (
                  <Badge
                    key={item?.Project?.id || index}
                    className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 border border-blue-200 rounded-full font-medium"
                  >
                    {item?.Project?.name || g('N_A')}
                  </Badge>
                ))}
                {vendorsDetail.projectName.length > 2 && (
                  <Badge
                    onClick={() => setShowAllProjects((prev) => !prev)}
                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full font-medium cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    {showAllProjects
                      ? t('SHOW_LESS')
                      : `+${vendorsDetail.projectName.length - 2} ${g('MORE')}`}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-gray-400 text-sm">{g('N_A')}</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Wallet size={20} strokeWidth={1.5} />
              <p>{g('WALLET_ADDRESS')}</p>
            </div>
            <div
              className="flex space-x-3 items-center"
              onClick={() => clickToCopy(vendorsDetail?.walletAddress)}
            >
              <p className="text-muted-foreground text-base truncate w-48">
                {vendorsDetail?.walletAddress ?? '-'}
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
              <p>{g('PHONE_NUMBER')}</p>
            </div>
            <p className="text-muted-foreground text-base">
              {vendorsDetail?.phone || '-'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Mail size={20} strokeWidth={1.5} />
              <p>{g('EMAIL_ADDRESS')}</p>
            </div>
            <p className="text-muted-foreground text-base">
              {vendorsDetail?.email || '-'}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Calendar size={20} strokeWidth={1.5} />
              <p>{t('REGISTERED_DATE')}</p>
            </div>
            <p className="text-muted-foreground text-base">
              {formattedDate || '-'}
            </p>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{g('ASSIGN_PROJECT')}</DialogTitle>
            <DialogDescription>
              {!selectedProject && (
                <p className="text-orange-500">{t('SELECT_A_PROJECT_TO_ASSIGN')}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Select onValueChange={handleProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('SELECT')} />
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
                  <p className="text-xs">{t('NO_PROJECT_FOUND')}</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                {g('CLOSE')}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={handleAssignProject}
                type="button"
                variant="ghost"
                className="text-primary"
              >
                {g('ASSIGN')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
