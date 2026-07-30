'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Copy,
  Users,
  Banknote,
  CircleCheckBig,
  CopyCheck,
  Info,
  ExternalLinkIcon,
} from 'lucide-react';
import { Heading, NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import {
  PROJECT_SETTINGS_KEYS,
  useGetAASafeOwners,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import MultisigProposeBtn from './propose.btn';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { formatUnits } from 'viem';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useTranslations } from 'next-intl';

interface CardProps {
  title: string;
  tip: string;
  content: string | number;
  color: string;
  icon: React.ReactNode;
}

export default function MultiSigWALLETView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const { clickToCopy, copyAction } = useCopy();
  const t = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const tg = useTranslations('GLOBAL');
  const formatDate = useDateFormat();

  const {
    data: safeOwners,
    isLoading: loadingSafeOwners,
    transfers,
  } = useGetAASafeOwners(projectUUID);

  const chainSettings = useProjectSettingsStore(
    (state) =>
      state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS] ||
      null,
  );

  const safeSettings = useProjectSettingsStore(
    (state) =>
      state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.SAFE_WALLET] ||
      null,
  );

  const safeNetwork = chainSettings?.network || 'basesep';
  const safeWALLET = safeSettings?.address;

  const InfoCardData: CardProps[] = [
    {
      title: t('TOTAL_BALANCE'),
      tip: t('TOTAL_BALANCE_TOOLTIP'),
      content: `${safeOwners?.projectBalance} RHT` || tg('N_A'),
      color: 'green',
      icon: <Banknote strokeWidth={2.5} />,
    },
    {
      title: t('SIGNATURE_THRESHOLD'),
      tip: t('SIGNATURE_THRESHOLD_TOOLTIP'),
      content: `${safeOwners?.threshold || '-'} of ${
        safeOwners?.owners?.length || '-'
      }`,
      color: 'purple',
      icon: <CircleCheckBig strokeWidth={2.5} />,
    },
    {
      title: t('ACTIVE_OWNERS'),
      tip: t('ACTIVE_OWNERS_TOOLTIP'),
      content: safeOwners?.owners?.length || tg('N_A'),
      color: 'blue',
      icon: <Users strokeWidth={2.5} />,
    },
  ];

  const openSafeTx = () => {
    window.open(
      `https://app.safe.global/transactions/queue?safe=${safeNetwork}:${safeWALLET}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const InfoCard = ({ title, content, color, icon, tip }: CardProps) => {
    return (
      <Card
        className={`rounded-sm text-${color}-500 bg-${color}-50 border-${color}-100`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    size={16}
                    className="text-muted-foreground cursor-help hover:text-primary transition-colors"
                  />
                </TooltipTrigger>
                <TooltipContent className="w-72">
                  <p>{tip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{content}</div>
        </CardContent>
      </Card>
    );
  };

  return loadingSafeOwners ? (
    <div className="h-[calc(100vh-300px)]">
      <SpinnerLoader />
    </div>
  ) : (
    <div className="h-[calc(100vh-260px)]">
      <div className="flex justify-between space-x-4">
        <Heading
          title={t('GNOSIS_WALLET_OVERVIEW')}
          description={t('OVERVIEW_OF_YOUR_GNOSIS_WALLET')}
          titleStyle="text-lg"
        />
        <MultisigProposeBtn
          projectUUID={projectUUID}
          tokenBalance={safeOwners?.projectBalance || ''}
          isTxPending={safeOwners?.pendingTxCount > 0}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {InfoCardData?.map((card) => (
          <InfoCard
            key={card.title}
            title={card.title}
            content={card.content}
            color={card.color}
            icon={card.icon}
            tip={card.tip}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-sm">
          <CardHeader className="p-4">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm lg:text-base">
                {t('SAFE_WALLET_DETAILS')}
              </CardTitle>

              <TooltipComponent
                Icon={ExternalLinkIcon}
                tip={t('REDIRECT_TO_SAFE_WALLET')}
                handleOnClick={openSafeTx}
                iconStyle="text-primary"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            {!loadingSafeOwners ? (
              <>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-sm">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {tg('WALLET_ADDRESS')}
                    </p>
                    <p className="text-sm text-gray-600 font-mono">
                      {safeOwners?.address}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clickToCopy(safeOwners?.address || '', 1)}
                  >
                    {copyAction === 1 ? (
                      <CopyCheck size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {t('AUTHORIZED_OWNERS')}
                  </h4>
                  <ScrollArea className="h-[calc(100vh-655px)]">
                    <div className="space-y-2">
                      {safeOwners?.owners.map((owner: any) => (
                        <div
                          key={owner}
                          className="flex items-center justify-between p-3 border rounded-sm"
                        >
                          <div>
                            <p className="text-sm text-gray-600 font-mono">
                              {owner}
                            </p>
                          </div>
                          <Badge className="bg-green-50 text-green-600 border-green-500 font-medium">
                            {tg('ACTIVE')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <SpinnerLoader />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-sm lg:text-base">
              {t('RECENT_TRANSFERS')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ScrollArea className="h-[calc(100vh-555px)]">
              <div className="space-y-3">
                {transfers?.length ? (
                  transfers?.map((tx: any, index: number) => (
                    <div
                      key={`${index}-${tx?.type}-${tx?.blockNumber}`}
                      className="flex items-center justify-between p-3 border rounded-sm"
                    >
                      <div>
                        <p className="text-sm font-medium">{t('TRANSFER')}</p>
                        <p className="text-xs">
                          {tg('TO')}: {truncateEthAddress(tx?.to)}
                        </p>
                        <p className="text-xs text-gray-600">
                           {formatDate(tx?.submissionDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatUnits(BigInt(tx?.value), safeOwners?.decimals)}{' '}
                          RHT
                        </p>
                        <Badge
                          className={`font-medium ${
                            tx?.isSuccess
                              ? 'bg-green-50 text-green-600 border-green-500'
                              : 'bg-orange-50 text-orange-600 border-orange-500'
                          }`}
                        >
                          {tx?.isSuccess ? tg('SUCCESS') : tg('PENDING')}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoResult />
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
