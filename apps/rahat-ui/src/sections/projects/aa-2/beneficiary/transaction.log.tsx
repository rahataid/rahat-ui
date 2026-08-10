'use client';
import React, { useState } from 'react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import {
  PROJECT_SETTINGS_KEYS,
  useBeneficiaryRedeemInfo,
  useBeneficiaryRedeemInfoInkind,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { TransactionLogItem } from './TransactionLogItem';
import { InKindLog } from '../vendor/types';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

type TransactionProps = {
  uuid: string;
  txHash: string;
  transactionType: string;
  tokenAmount: number;
  createdAt: string;
  payoutType: string;
  mode: string;
  extras?: any;
  vendorName?: string;
  updatedAt: string;
};

const TransactionLogs = () => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const params = useParams();
  const projectId = params.id as UUID;
  const beneficiaryId = params.uuid as UUID;
  const project = useProjectStore((p) => p.singleProject);
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));

  const [activeTab, setActiveTab] = useState('fsp');

  const { data: transactions, isLoading } = useBeneficiaryRedeemInfo({
    projectUUID: projectId,
    beneficiaryUUID: beneficiaryId,
  });

  const { data: inkindLogs, isLoading: isInkindLoading } =
    useBeneficiaryRedeemInfoInkind({
      projectUUID: projectId,
      beneficiaryUUID: beneficiaryId,
    });

  const { clickToCopy, copyAction } = useCopy();

  if (isLoading || isInkindLoading) {
    return (
      <div className="flex items-center justify-center h-full ">
        <SpinnerLoader />
      </div>
    );
  }
  // 1. Categorize transactions
  const fspTransactions =
    transactions?.filter((txn: TransactionProps) => txn.payoutType === 'FSP') ??
    [];

  const cvaTransactions =
    transactions?.filter(
      (txn: TransactionProps) => txn.payoutType === 'VENDOR',
    ) ?? [];

  const inkindTransactions = inkindLogs ?? [];

  // 2. Tab config with counts
  const TabsTriggerStats = [
    { value: 'fsp', title: t('FSP'), count: fspTransactions.length },
    { value: 'cva', title: t('CVA'), count: cvaTransactions.length },
    { value: 'inkind', title: t('IN_KIND'), count: inkindTransactions.length },
  ];

  // 3. Reusable renderer for FSP/CVA transactions
  const renderTransactions = (txnList: TransactionProps[]) => {
    if (!txnList.length) return <NoResult />;

    return txnList.map((txn) => {
      const txnUrl = getExplorerUrl({
        chainSettings:
          settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
        target: 'tx',
        value: txn?.txHash,
      });

      const subtitleParts = [
        txn?.payoutType === 'VENDOR' ? 'CVA' : txn?.payoutType,
        txn?.payoutType === 'FSP'
          ? txn?.extras?.paymentProviderName?.split('_').join(' ')
          : txn?.mode,
        txn?.mode === 'OFFLINE' && txn?.vendorName ? txn.vendorName : null,
      ].filter(Boolean);

      return (
        <TransactionLogItem
          key={txn?.txHash}
          title={t('AMOUNT_DISBURSED')}
          subtitle={subtitleParts.join(' • ')}
          txHash={txn?.txHash}
          txUrl={txnUrl ?? ''}
          amount={`${t('RS')} ${formatNum(txn?.tokenAmount)}`}
          date={formatDate(txn?.updatedAt, 'dd MMMM, yyyy')}
          time={formatDate(txn?.updatedAt, 'hh:mm:ss a')}
          onCopy={() => clickToCopy(txn?.txHash, txn?.uuid)}
          isCopied={copyAction === txn?.txHash}
        />
      );
    });
  };

  // 4. Reusable renderer for In-kind transactions
  const renderInkindTransactions = (inkindList: typeof inkindTransactions) => {
    if (!inkindList.length) return <NoResult />;

    return inkindList.map((item: InKindLog) => {
      const txnUrl = getExplorerUrl({
        chainSettings:
          settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
        target: 'tx',
        value: item?.txHash,
      });
      const rawInkindType = item.groupInkind.inkind.type;
      const inkindType = tg.has(rawInkindType as never)
        ? tg(rawInkindType as never)
        : rawInkindType.replace('_', ' ');
      return (
        <TransactionLogItem
          key={item?.uuid}
          title={item?.groupInkind?.inkind?.name}
          subtitle={[inkindType, item?.Vendor?.name].join(' • ')}
          txHash={item?.txHash}
          txUrl={txnUrl || '#'}
          amount={formatNum(item?.quantity)}
          date={formatDate(item?.redeemedAt, 'dd MMMM, yyyy')}
          time={formatDate(item?.redeemedAt, 'hh:mm:ss a')}
          onCopy={() => clickToCopy(item?.txHash, item?.uuid)}
          isCopied={copyAction === item?.txHash}
        />
      );
    });
  };

  return (
    <>
      <h2 className="text-xl font-semibold">{t('TRANSACTION_LOG')}</h2>
      <p className="text-sm text-muted-foreground">
        {t('LIST_OF_ALL_TOKEN_TRANSACTIONS')}
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border bg-secondary rounded w-full">
          {TabsTriggerStats.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full data-[state=active]:bg-white"
            >
              <span>{tab.title}</span>
              <span
                className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full
                ${
                  activeTab === tab.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {formatNum(tab.count)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[calc(100vh-500px)]">
          <TabsContent value="fsp">
            {renderTransactions(fspTransactions)}
          </TabsContent>

          <TabsContent value="cva">
            {renderTransactions(cvaTransactions)}
          </TabsContent>

          <TabsContent value="inkind">
            {renderInkindTransactions(inkindTransactions)}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </>
  );
};

export default TransactionLogs;
