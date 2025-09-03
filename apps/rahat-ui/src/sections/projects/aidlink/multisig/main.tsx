'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Copy, Users, Banknote, CircleCheckBig } from 'lucide-react';
import { Heading, NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useGetDisbursements, useGetSafeOwners } from '@rahat-ui/query';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

export default function MultiSigWalletView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const { data: disbursements, isLoading: loadingDisbursements } =
    useGetDisbursements({
      projectUUID,
      page: 1,
      perPage: 10,
    });

  const { data: safeOwners, isLoading: loadingSafeOwners } =
    useGetSafeOwners(projectUUID);

  return (
    <div className="p-4 space-y-4 bg-gray-50 h-[calc(100vh-58px)]">
      <Heading
        title="Gnosis Wallet Overview"
        description="Overview of your gnosis wallet"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-sm text-green-500 bg-green-50 border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Banknote strokeWidth={2.5} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {safeOwners?.nativeBalance || 'N/A'}
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
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Authorized Owners
                  </h4>
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
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {!loadingDisbursements ? (
              <div className="space-y-3">
                {disbursements?.length ? (
                  disbursements?.map((tx: any) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 border rounded-sm"
                    >
                      <div>
                        <p className="text-sm font-medium">Disbursement</p>
                        <p className="text-xs text-gray-600">
                          {dateFormat(tx.updatedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{tx.amount}</p>
                        <Badge className="font-medium">{tx.status}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoResult />
                )}
              </div>
            ) : (
              <SpinnerLoader />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
