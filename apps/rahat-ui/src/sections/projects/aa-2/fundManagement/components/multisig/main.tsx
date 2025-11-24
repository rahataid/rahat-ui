'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Copy, Users, Banknote, CircleCheckBig, CopyCheck } from 'lucide-react';
import { Heading, NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { useGetAASafeOwners } from '@rahat-ui/query';
import MultisigProposeBtn from './propose.btn';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

export default function MultiSigWalletView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const { clickToCopy, copyAction } = useCopy();

  const { data: safeOwners, isLoading: loadingSafeOwners } =
    useGetAASafeOwners(projectUUID);

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
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="rounded-sm text-green-500 bg-green-50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Banknote strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {`${safeOwners?.tokenBalance} RHT` || 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm text-purple-500 bg-purple-50 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Signature Threshold
            </CardTitle>
            <CircleCheckBig strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeOwners?.threshold || '-'} of{' '}
              {safeOwners?.owners?.length || '-'}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm text-blue-500 bg-blue-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Owners</CardTitle>
            <Users strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeOwners?.owners?.length || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-sm lg:text-base">
              Multisig Wallet Details
            </CardTitle>
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
                {safeOwners?.transfers?.length ? (
                  safeOwners?.transfers?.map((tx: any) => (
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
                          {dateFormat(tx?.executionDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {tx?.value / 10} RHT
                          {/* divisor is 10 because decimals is 1 */}
                        </p>
                        <Badge className="font-medium">Success</Badge>
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
