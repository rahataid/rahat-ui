import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  BadgeCheck,
  CalendarIcon,
  CheckCircleIcon,
  Copy,
  CopyCheck,
  CopyIcon,
  UsersIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  PROJECT_SETTINGS_KEYS,
  useGetDisbursement,
  useGetDisbursementApprovals,
  useGetDisbursementTransactions,
  useMultiSigDisburseToken,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Heading, NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import React from 'react';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import Link from 'next/link';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { TransactionDisbursedModal } from './transactionDisbursedModal';
import { parseUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';
import { toast } from 'react-toastify';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { useReadRahatTokenDecimals } from 'apps/rahat-ui/src/hooks/c2c/contracts/rahatToken';

export default function DisbursementHistoryDetail() {
  const { id: projectUUID, disbursementId } = useParams() as {
    id: UUID;
    disbursementId: UUID;
  };
  const { clickToCopy, copyAction } = useCopy();

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [executionResult, setExecutionResult] = React.useState<any>(null);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const safeWallet = useProjectSettingsStore(
    (state) => state?.settings?.[projectUUID]?.['SAFE_WALLET']?.address,
  );

  const chainSettings = useProjectSettingsStore(
    (state) => state?.settings?.[projectUUID]?.['BLOCKCHAIN'],
  );
  const {data:tokenNumber} = useReadRahatTokenDecimals({address:contractSettings?.rahattoken?.address})


  const { isConnected } = useAccount();
  const chainId = useChainId();

  const { data: disbursement } = useGetDisbursement(
    projectUUID,
    disbursementId,
  );

  const { data: transactions, isLoading: loadingTransactions } =
    useGetDisbursementTransactions({
      projectUUID: projectUUID,
      disbursementUUID: disbursementId,
      page: 1,
      perPage: 10,
    });

  const { data: approvals, isLoading: loadingApprovals } =
    useGetDisbursementApprovals({
      projectUUID: projectUUID,
      disbursementUUID: disbursementId,
      page: 1,
      perPage: 10,
      transactionHash: disbursement?.transactionHash,
    });

  const isReadyToExecute = React.useMemo(
    () =>
      approvals
        ? approvals?.approvalsCount === approvals?.confirmationsRequired
        : false,
    [approvals],
  );

  const colorCardData = React.useMemo(
    () => [
      {
        icon: (
          <UsersIcon className="text-blue-600" size={20} strokeWidth={2.5} />
        ),
        label: 'Total Beneficiaries',
        value: disbursement?.beneficiaries?.length || 'N/A',
        color: 'blue',
      },
      {
        icon: (
          <CheckCircleIcon
            className="text-green-600"
            size={20}
            strokeWidth={2.5}
          />
        ),
        label: 'Total Disbursed Amount',
        value: `${disbursement?.amount} USDC` || 'N/A',
        color: 'green',
      },
      {
        icon: (
          <UsersIcon className="text-teal-600" size={20} strokeWidth={2.5} />
        ),
        label: 'Disbursement Type',
        value: disbursement?.type
          ? capitalizeFirstLetter(disbursement?.type)
          : 'N/A',
        color: 'teal',
      },
    ],
    [disbursement],
  );

  const disburseMultiSig = useMultiSigDisburseToken({
    disbursementId: disbursement?.id,
    projectUUID,
  });

  const handleExecute = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet to execute the transaction.');
      return;
    }
    if (chainId !== Number(chainSettings?.chainid)) {
      toast.error(`Please connect to ${chainSettings?.chainname} chain `);
      return;
    }

    const beneficiaryLength = disbursement?.beneficiaries.length;

    // const amountString = disbursement?.DisbursementBeneficiary[0]?.amount
    //   ? disbursement?.DisbursementBeneficiary[0]?.amount.toString()
    //   : '0';
    const amountString =
      (disbursement?.amount / beneficiaryLength)?.toString() || '0';
    const parsedAmount = parseUnits(amountString, Number(tokenNumber));
    // const result = await disburseMultiSig.mutateAsync({
    //   amount: parsedAmount,
    //   beneficiaryAddresses: disbursement?.DisbursementBeneficiary?.map(
    //     (d: any) => d.beneficiaryWalletAddress,
    //   ) as `0x${string}`[],
    //   rahatTokenAddress: contractSettings?.rahattoken?.address,
    //   safeAddress: safeWallet,
    //   c2cProjectAddress: contractSettings?.c2cproject?.address,
    // });
    const result = await disburseMultiSig.mutateAsync({
      amount: parsedAmount,
      beneficiaryAddresses: disbursement?.beneficiaries?.map(
        (d: any) => d.walletAddress,
      ) as `0x${string}`[],
      rahatTokenAddress: contractSettings?.rahattoken?.address,
      safeAddress: safeWallet,
      c2cProjectAddress: contractSettings?.c2cproject?.address,
    });

    if (result) {
      setExecutionResult(result);
      setIsModalOpen(true);
    }
  };
  return (
    <>
      <TransactionDisbursedModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={executionResult}
      />
      <div className="p-4 bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Heading
            title="Disbursement History"
            description="List of all your disbursement history"
            backBtn
          />
          <div className="flex items-center gap-4">
            {approvals?.isExecuted && disbursement?.status !== 'COMPLETED' && (
              <Button
                disabled={disburseMultiSig.isPending}
                className="h-8 w-40"
                onClick={handleExecute}
              >
                Execute
              </Button>
            )}
            {!approvals?.isExecuted &&
              disbursement?.status !== 'COMPLETED' &&
              approvals?.approvals?.length > 0 && (
                <Link
                  href="https://app.safe.global/transactions/queue?safe=basesep:0x8241F385c739F7091632EEE5e72Dbb62f2717E76"
                  target="_blank"
                >
                  <div className="px-4 py-1 rounded-full flex items-center gap-2 bg-blue-50 hover:bg-blue-100">
                    <span className="text-[10px]/4 tracking-widest font-semibold text-primary">
                      SAFEWALLET
                    </span>
                    <BadgeCheck className="w-4 h-4 fill-primary text-white" />
                  </div>
                </Link>
              )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-sm bg-card p-4 border">
            <h1 className="text-sm/6 font-medium text-gray-800 mb-2">Status</h1>
            <Badge variant="secondary">
              {disbursement?.type
                ? capitalizeFirstLetter(disbursement?.status)
                : 'N/A'}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{dateFormat(disbursement?.updatedAt)}</span>
            </div>
          </div>

          {colorCardData?.map((d) => (
            <div
              key={d.label}
              className={`p-4 rounded-sm border border-${d.color}-200 bg-${d.color}-50/50`}
            >
              <div className="flex items-center justify-between mb-6">
                <p className={`text-sm text-${d.color}-600 font-medium`}>
                  {d.label}
                </p>
                {d.icon}
              </div>
              <div className={`text-xl font-semibold text-${d.color}-600`}>
                {d.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Transactions Section */}
          <div className="p-4 border rounded-sm bg-card ">
            <Heading
              title="TRANSACTIONS"
              titleStyle="tracking-wider"
              description="List of all transactions made"
            />
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="space-y-4">
                {!loadingTransactions ? (
                  transactions?.length > 0 ? (
                    transactions?.map((transaction: any) => (
                      <Card key={transaction.id} className="p-4 rounded-sm">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="text-l font-medium">
                              {transaction.amount
                                ? `${transaction.amount} USDC`
                                : 'N/A'}
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <span>From:</span>
                                <span className="font-mono">
                                  {transaction.from
                                    ? truncateEthAddress(transaction.from)
                                    : 'N/A'}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    clickToCopy(
                                      transaction.from,
                                      transaction.from,
                                    )
                                  }
                                >
                                  {copyAction === transaction.from ? (
                                    <CopyCheck size={16} />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>To:</span>
                                <span className="font-mono">
                                  {transaction.beneficiaryWalletAddress
                                    ? truncateEthAddress(
                                        transaction.beneficiaryWalletAddress,
                                      )
                                    : 'N/A'}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    clickToCopy(
                                      transaction.beneficiaryWalletAddress,
                                      transaction.beneficiaryWalletAddress,
                                    )
                                  }
                                >
                                  {copyAction ===
                                  transaction.beneficiaryWalletAddress ? (
                                    <CopyCheck size={16} />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.updatedAt
                                ? dateFormat(transaction.updatedAt)
                                : 'N/A'}
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {transaction.Disbursement?.status}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <NoResult />
                  )
                ) : (
                  <SpinnerLoader />
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Approvals Section */}
          <div className="p-4 border rounded-sm bg-card ">
            <Heading
              title="APPROVALS"
              titleStyle="tracking-wider"
              description={`Approved: ${
                approvals?.approvalsCount || 'N/A'
              } Required: ${approvals?.confirmationsRequired || 'N/A'}`}
            />
            <ScrollArea className="h-[calc(100vh-500px)]">
              <div className="space-y-4">
                {!loadingApprovals ? (
                  approvals?.approvals?.length > 0 ? (
                    approvals?.approvals?.map((approval: any) => (
                      <Card key={approval.owner} className="p-4 rounded-sm">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="font-medium">
                              {approval.owner
                                ? truncateEthAddress(approval.owner)
                                : 'N/A'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Submission:{' '}
                              {approval.submissionDate
                                ? dateFormat(approval.submissionDate)
                                : 'N/A'}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              approval.hasApproved
                                ? 'border-green-200 text-green-700 bg-green-50'
                                : 'border-orange-200 text-orange-700 bg-orange-50'
                            }`}
                          >
                            {approval.hasApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <NoResult />
                  )
                ) : (
                  <SpinnerLoader />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
