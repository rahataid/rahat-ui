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
import { useLocale, useTranslations } from 'next-intl';
import { localizeNepaliParts } from 'apps/rahat-ui/src/utils/i18n/date';
import { GlobalCan } from 'apps/rahat-ui/src/components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

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
  const locale = useLocale();
  const formatPhone = usePhoneFormat();
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
      successMessage: g('VENDOR_ASSIGNED_SUCCESSFULLY'),
      errorMessage: g('ERROR_WHILE_UPDATING_VENDOR'),
    });
    projectModal.onFalse();
  };

  const assignVoucher = () => {
    projectModal.onTrue();
  };

  const deleteVendor = async () => {
    if (isVendorAssigned)
      return toast.warning(t('ASSIGNED_VENDOR_CANNOT_BE_DELETED'));

    await removeVendor.mutateAsync({
      vendorId: vendorsDetail.id,
      successMessage: g('VENDOR_REMOVED_SUCCESSFULLY'),
      errorMessage: g('ERROR_WHILE_REMOVING_VENDOR'),
    });
    closeSecondPanel();
  };
  const formattedDate = React.useMemo(() => {
    if (
      !vendorsDetail?.createdAt ||
      isNaN(new Date(vendorsDetail.createdAt).getTime())
    ) {
      return g('N_A');
    }
    const d = new Date(vendorsDetail.createdAt);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kathmandu',
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const neOptions =
      locale === 'ne' ? { ...options, numberingSystem: 'deva' } : options;
    const formatter = new Intl.DateTimeFormat(
      locale === 'ne' ? 'ne-NP' : locale,
      neOptions,
    );
    return locale === 'ne'
      ? localizeNepaliParts(d, options, formatter.formatToParts(d))
      : formatter.format(d);
  }, [vendorsDetail?.createdAt, locale, g]);

  return (
    <div className="h-full border-l">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-4">
          <GlobalCan action={ACTIONS.DELETE} subject={SUBJECTS.VENDOR}>
            <DeleteButton
              className={`border-none p-0 shadow-none ${
                isVendorAssigned ? 'hidden' : ''
              }`}
              name="vendor"
              handleContinueClick={deleteVendor}
            />
          </GlobalCan>

          {vendorsDetail?.projectName === 'N/A' && (
            <GlobalCan action={ACTIONS.UPDATE} subject={SUBJECTS.VENDOR}>
              <TooltipComponent
                handleOnClick={assignVoucher}
                Icon={FolderPlus}
                tip={t('SELECT_A_PROJECT_TO_ASSIGN')}
              />
            </GlobalCan>
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
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full border-2 border-primary/20 shadow-sm"
            src="/profile.png"
            alt="profile"
            height={80}
            width={80}
          />
          <div>
            <h1 className="mb-2 text-xl font-semibold">
              {vendorsDetail?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                {translateValue(g, vendorsDetail?.status, {
                  fallbackStyle: 'raw',
                }) || g('N_A')}
              </Badge>
              <span className="rounded-full border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
                {translateValue(g, vendorsDetail?.gender, {
                  fallbackStyle: 'raw',
                }) || g('N_A')}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-240px)] [&_[data-radix-scroll-area-viewport]>div]:!block">
        <div className="flex flex-col gap-4 p-4 ">
          <section className="rounded-sm border bg-card p-4 shadow-sm">
            <h2 className="mb-4 border-l-4 border-primary pl-3 text-base font-semibold">
              {g('GENERAL')}
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <FolderDot
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{g('PROJECT_NAME')}</p>
                </div>
                {Array.isArray(vendorsDetail?.projectName) &&
                vendorsDetail.projectName.length > 0 ? (
                  <div className="flex max-w-[200px] flex-wrap justify-end gap-1.5">
                    {(showAllProjects
                      ? vendorsDetail.projectName
                      : vendorsDetail.projectName.slice(0, 2)
                    ).map((item: any, index: number) => (
                      <Badge
                        key={item?.Project?.id || index}
                        variant="secondary"
                        className="rounded-full border border-border/60 text-xs font-medium"
                      >
                        {item?.Project?.name || g('N_A')}
                      </Badge>
                    ))}
                    {vendorsDetail.projectName.length > 2 && (
                      <Badge
                        onClick={() => setShowAllProjects((prev) => !prev)}
                        variant="outline"
                        className="cursor-pointer rounded-full text-xs font-medium transition-colors hover:bg-muted"
                      >
                        {showAllProjects
                          ? t('SHOW_LESS')
                          : `+${vendorsDetail.projectName.length - 2} ${g(
                              'MORE',
                            )}`}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-right text-sm text-muted-foreground">
                    {g('N_A')}
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <Wallet
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{g('WALLET_ADDRESS')}</p>
                </div>
                <div className="flex min-w-0 items-center gap-3">
                  <p className="w-28 truncate text-right text-sm text-muted-foreground">
                    {vendorsDetail?.walletAddress ?? '-'}
                  </p>
                  {vendorsDetail?.walletAddress && (
                    <button
                      type="button"
                      onClick={() => clickToCopy(vendorsDetail.walletAddress)}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={g('WALLET_ADDRESS')}
                    >
                      {walletAddressCopied ? (
                        <CopyCheck size={16} strokeWidth={1.5} />
                      ) : (
                        <Copy size={16} strokeWidth={1.5} />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <Phone
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{g('PHONE_NUMBER')}</p>
                </div>
                <p className="break-all text-right text-sm text-muted-foreground">
                  {formatPhone(vendorsDetail?.phone) || '-'}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <Mail
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{g('EMAIL_ADDRESS')}</p>
                </div>
                <p className="break-all text-right text-sm text-muted-foreground">
                  {vendorsDetail?.email || '-'}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <Calendar
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{t('REGISTERED_DATE')}</p>
                </div>
                <p className="text-right text-sm text-muted-foreground">
                  {formattedDate || '-'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>

      <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{g('ASSIGN_PROJECT')}</DialogTitle>
            <DialogDescription>
              {!selectedProject && (
                <p className="text-orange-500">
                  {t('SELECT_A_PROJECT_TO_ASSIGN')}
                </p>
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
