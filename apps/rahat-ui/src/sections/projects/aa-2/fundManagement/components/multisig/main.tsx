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
  ExternalLink,
} from 'lucide-react';
import { Heading, NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
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
import Link from 'next/link';
import { formatUnits } from 'viem';

interface CardProps {
  title: string;
  tip: string;
  content: string | number;
  color: string;
  icon: React.ReactNode;
}

export default function MultiSigWalletView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const { clickToCopy, copyAction } = useCopy();

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
  const safeWallet = safeSettings?.address;

  const InfoCardData: CardProps[] = [
    {
      title: 'Total Balance',
      tip: 'The total amount of available Rahat tokens currently held in the Safe wallet that can be proposed and added to the Project AA Project balance.',
      content: `${safeOwners?.tokenBalance} RHT` || 'N/A',
      color: 'green',
      icon: <Banknote strokeWidth={2.5} />,
    },
    {
      title: 'Signature Threshold',
      tip: 'The minimum number of authorized owners who must approve and sign a multi-sig transaction in the Safe wallet before the transaction can be successfully executed.',
      content: `${safeOwners?.threshold || '-'} of ${
        safeOwners?.owners?.length || '-'
      }`,
      color: 'purple',
      icon: <CircleCheckBig strokeWidth={2.5} />,
    },
    {
      title: 'Active Owners',
      tip: 'The total number of active Safe wallet owners or admin who are authorized to sign and execute Gnosis multi-sig transactions.',
      content: safeOwners?.owners?.length || 'N/A',
      color: 'blue',
      icon: <Users strokeWidth={2.5} />,
    },
  ];

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
          title="Gnosis Wallet Overview"
          description="Overview of your gnosis wallet"
          titleStyle="text-2xl"
        />
        <MultisigProposeBtn
          projectUUID={projectUUID}
          tokenBalance={safeOwners?.tokenBalance || ''}
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
                Safe Wallet Details
              </CardTitle>
              <Link
                href={`https://app.safe.global/transactions/queue?safe=${safeNetwork}:${safeWallet}`}
                target="_blank"
                className="text-primary"
              >
                <ExternalLink size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            {!loadingSafeOwners ? (
              <>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-sm">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Wallet Address
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
                    Authorized Owners
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
                            active
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
              Recent Transfers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ScrollArea className="h-[calc(100vh-555px)]">
              <div className="space-y-3">
                {transfers?.length ? (
                  transfers?.map((tx: any) => (
                    <div
                      key={`${tx?.type}-${tx?.blockNumber}`}
                      className="flex items-center justify-between p-3 border rounded-sm"
                    >
                      <div>
                        <p className="text-sm font-medium">Transfer</p>
                        <p className="text-xs">
                          To: {truncateEthAddress(tx?.to)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {dateFormat(tx?.modified)}
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
                          {tx?.isSuccess ? 'Success' : 'Pending'}
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
