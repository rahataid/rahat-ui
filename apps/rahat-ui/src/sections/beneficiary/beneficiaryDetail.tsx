'use client';

import { useBeneficiaryStore, useSingleBeneficiary } from '@rahat-ui/query';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { UUID } from 'crypto';
import {
  Copy,
  CopyCheck,
  Expand,
  FolderPlus,
  Landmark,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  WalletIcon,
  Wifi,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useBoolean } from '../../hooks/use-boolean';
import AssignToProjectModal from './components/assignToProjectModal';
import DeleteBeneficiaryModal from './components/deleteBenfModal';
import TooltipComponent from '../../components/tooltip';
import { humanizeString } from '../../utils';
import useCopy from '../../hooks/useCopy';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useTranslations } from 'next-intl';
import { GlobalCan } from 'apps/rahat-ui/src/components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';

type IProps = {
  beneficiaryDetail: any;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetail,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  useSingleBeneficiary(beneficiaryDetail.uuid as UUID);
  const beneficiary = useBeneficiaryStore((state) => state.singleBeneficiary);
  const projectModal = useBoolean();
  const deleteModal = useBoolean();
  const searchParams = useSearchParams();
  const { clickToCopy, copyAction } = useCopy();
  const { Id } = useParams();
  const t = useTranslations('BENEFICIARY_DETAIL');
  const g = useTranslations('GLOBAL');

  const formatNum = useNumberFormat();
  const formatPhone = usePhoneFormat();

  const formatEnumValue = (value?: string) =>
    translateValue(g, value, { fallbackStyle: 'raw' });

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  const handleDeleteClick = () => {
    deleteModal.onTrue();
  };
  const benfAssignedToProject = beneficiaryDetail?.BeneficiaryProject?.length;
  const fromTab = searchParams.get('fromTab');
  const isAssignedToProject = searchParams.get('isAssignedToProject');
  const isGroupValidForAA = searchParams.get('isGroupValidForAA');
  return (
    <>
      <AssignToProjectModal
        beneficiaryDetail={beneficiaryDetail}
        projectModal={projectModal}
      />

      <DeleteBeneficiaryModal
        beneficiaryDetail={beneficiaryDetail}
        deleteModal={deleteModal}
        closeSecondPanel={closeSecondPanel}
      />
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-4">
          <GlobalCan action={ACTIONS.DELETE} subject={SUBJECTS.BENEFICIARY}>
            <TooltipComponent
              disable={benfAssignedToProject}
              handleOnClick={handleDeleteClick}
              Icon={Trash2}
              tip={g('DELETE')}
              iconStyle="text-red-600"
            />
          </GlobalCan>
          <GlobalCan action={ACTIONS.UPDATE} subject={SUBJECTS.BENEFICIARY}>
            <TooltipComponent
              handleOnClick={() =>
                router.push(
                  fromTab
                    ? `/beneficiary/${beneficiaryDetail.uuid}/edit?isAssignedToProject=${isAssignedToProject}&isGroupValidForAA=${isGroupValidForAA}&fromTab=${fromTab}&groupId=${Id}`
                    : `/beneficiary/${beneficiaryDetail.uuid}/edit`,
                )
              }
              Icon={Pencil}
              tip={g('EDIT')}
            />
          </GlobalCan>

          {!fromTab && (
            <>
              <GlobalCan action={ACTIONS.MANAGE} subject={SUBJECTS.BENEFICIARY}>
                <TooltipComponent
                  handleOnClick={handleAssignModalClick}
                  Icon={FolderPlus}
                  tip={g('ASSIGN_PROJECT')}
                />
              </GlobalCan>
              <TooltipComponent
                handleOnClick={() =>
                  router.push(`/beneficiary/${beneficiaryDetail.uuid}`)
                }
                Icon={Expand}
                tip={g('EXPAND')}
              />
            </>
          )}
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
              {beneficiaryDetail?.piiData?.name ??
                beneficiaryDetail?.name ??
                'John Doe'}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                {formatEnumValue(beneficiaryDetail?.extras?.status ?? 'active')}
              </Badge>
              <span className="rounded-full border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
                {beneficiaryDetail?.extras?.age
                  ? formatNum(beneficiaryDetail.extras.age)
                  : g('N_A')}
              </span>
              <span className="rounded-full border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
                {formatEnumValue(beneficiaryDetail?.gender) ?? g('UNKNOWN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-240px)] p-4 [&_[data-radix-scroll-area-viewport]>div]:!block">
        <div className="flex flex-col gap-4 p-2">
          <section className="rounded-lg border bg-card p-4 shadow-sm rounded-sm">
            <h2 className="mb-4 border-l-4 border-primary pl-3 text-base font-semibold">
              {g('GENERAL')}
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <MapPin
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{g('ADDRESS')}</p>
                </div>
                <p className="break-words text-right text-sm text-muted-foreground">
                  {beneficiaryDetail?.piiData?.extras?.address ||
                    beneficiaryDetail?.location ||
                    '-'}
                </p>
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
                  {formatPhone(
                    beneficiaryDetail?.piiData?.phone ||
                      beneficiaryDetail?.phone,
                  ) || '-'}
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
                  {beneficiaryDetail?.piiData?.email ||
                    beneficiaryDetail?.email ||
                    '-'}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <Phone
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{g('PHONE_STATUS')}</p>
                </div>
                <p className="text-right text-sm text-muted-foreground">
                  {formatEnumValue(beneficiaryDetail?.phoneStatus) || '-'}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <Landmark
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{t('BANK_STATUS')}</p>
                </div>
                <p className="text-right text-sm text-muted-foreground">
                  {formatEnumValue(beneficiaryDetail?.bankedStatus) || '-'}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <Wifi
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{g('INTERNET_STATUS')}</p>
                </div>
                <p className="text-right text-sm text-muted-foreground">
                  {formatEnumValue(beneficiaryDetail?.internetStatus) || '-'}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40">
                <div className="flex shrink-0 items-center gap-3">
                  <WalletIcon
                    className="rounded-md bg-secondary p-1 text-primary"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium">{g('WALLET_ADDRESS')}</p>
                </div>
                <div className="flex min-w-0 items-center">
                  <div className="max-w-32 truncate text-right text-sm text-muted-foreground">
                    {beneficiaryDetail?.walletAddress || g('N_A')}
                  </div>
                  <button
                    onClick={() =>
                      clickToCopy(beneficiaryDetail?.walletAddress || '', 1)
                    }
                    className="ml-2 shrink-0 text-sm text-muted-foreground hover:text-foreground"
                    aria-label={g('WALLET_ADDRESS')}
                  >
                    {copyAction === 1 ? (
                      <CopyCheck className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
          {beneficiaryDetail?.BeneficiaryProject && (
            <div
              className={`rounded-lg border bg-card p-4 rounded-sm shadow-sm ${
                beneficiaryDetail?.BeneficiaryProject?.length < 1 && 'hidden'
              }`}
            >
              <h2 className="mb-4 border-l-4 border-primary pl-3 text-base font-semibold">
                {t('PROJECT_INVOLVED')}
              </h2>
              <div className="flex flex-col gap-2">
                {beneficiaryDetail?.BeneficiaryProject?.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/20 px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/40"
                  >
                    <FolderPlus
                      className="rounded-md bg-secondary p-1 text-primary"
                      size={24}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    {item.Project?.name || '-'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank account details section */}
          {beneficiaryDetail?.bankAccount && (
            <div className=" rounded-md border border-primary/30 border-l-4 border-l-primary bg-primary/5 p-4 shadow-sm rounded-sm">
              <div className="flex items-center gap-3 border-b pb-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Landmark size={18} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h2 className="text-base font-semibold">
                  Validated Bank Details
                </h2>
              </div>
              <div className="divide-y divide-border/70">
                <div className="flex items-start justify-between gap-4 py-3">
                  <p className="text-sm font-medium ">Bank Name</p>
                  <p className="break-all text-right text-base font-medium text-muted-foreground">
                    {beneficiaryDetail.bankAccount.bankName || '-'}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <p className="text-sm font-medium ">Account Name</p>
                  <p className="break-all text-right text-base font-medium text-muted-foreground">
                    {beneficiaryDetail.bankAccount.accountName || '-'}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-4 pt-3">
                  <p className="text-sm font-medium ">Account Number</p>
                  <p className="break-all text-right text-base font-semibold tabular-nums text-muted-foreground">
                    {beneficiaryDetail.bankAccount.accountNumber || '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {beneficiaryDetail?.extras && (
            <section className="rounded-sm border bg-card p-4 shadow-sm">
              <h2 className="mb-4 border-l-4 border-primary pl-3 text-base font-semibold">
                {t('EXTRA_DETAILS')}
              </h2>

              {Object.keys(beneficiaryDetail?.extras || {}).length > 0 &&
                beneficiaryDetail?.extras && (
                  <div className="flex flex-col gap-2">
                    {Object.entries(beneficiaryDetail.extras)
                      .filter(([key]) => {
                        const cleanKey = key.trim().toLowerCase();
                        return ![
                          'error',
                          'bankedstatus',
                          'validbankaccount',
                          'token',
                        ].includes(cleanKey);
                      })
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start justify-between gap-4 rounded-md border border-border/60 bg-muted/20 px-3 py-3 transition-colors hover:bg-muted/40"
                        >
                          <p className="text-sm font-medium">
                            {humanizeString(key)}
                          </p>
                          <p className="break-all text-right text-sm text-muted-foreground">
                            {typeof value === 'string' &&
                            value.startsWith('http') ? (
                              <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 no-underline"
                              >
                                {t('VIEW_LINK')}
                              </a>
                            ) : typeof value === 'boolean' ? (
                              value ? (
                                g('YES')
                              ) : (
                                g('NO')
                              )
                            ) : (
                              String(value) || '-'
                            )}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
            </section>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
