// import { dFMTransactionsData } from '../static';
import {
  PROJECT_SETTINGS_KEYS,
  useFetchTokenStatsStellar,
  useFundAssignmentStore,
  useGroupsReservedFunds,
  usePagination,
  useProjectDashboardReporting,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import { DataCard, Heading, TransactionCard } from 'apps/rahat-ui/src/common';
import { useChains } from 'connectkit';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import TokenOverviewSkeleton from './token.overview.skeleton';
import DynamicPieChart from '../../../components/dynamicPieChart';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { useProjectBalance } from 'apps/rahat-ui/src/hooks/aa/utils';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function TokensOverview() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const tc = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const uuid = useParams().id;
  const projectId = uuid as UUID;
  const { data, isLoading } = useFetchTokenStatsStellar({
    projectUUID: uuid,
  });

  const { data: getTokenStat } = useProjectDashboardReporting(projectId);

  const chains = useChains();
  const { pagination } = usePagination();
  const { data: groupsFundsData } = useGroupsReservedFunds(projectId, {
    page: pagination.page,
    perPage: 99999,
    sort: 'updatedAt',
    order: 'desc',
  });
  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));
  const project = useProjectStore((p) => p.singleProject);
  const projectBalance = useProjectBalance(projectId);
  const formatNum = useNumberFormat();

  const getNameKey = (name: string) =>
    name === 'Token Price' ? 'TOKEN_PRICE' :
    name === 'Average Disbursement time' ? 'AVERAGE_DISBURSEMENT_TIME' :
    name === 'Average Duration' ? 'AVERAGE_DURATION' :
    name.toUpperCase().replace(/\s+/g, '_');

  // const projectBalance = useFundAssignmentStore(
  //   (state) => state.projectBalance,
  // );

  const tokenStatus = () => {
    let disbursedValue = 0;
    let failedValue = 0;
    let notDisbursedValue = 0;

    groupsFundsData?.data?.forEach(({ status, numberOfTokens = 0 }) => {
      const stat = status?.toUpperCase();
      if (stat === 'DISBURSED') {
        disbursedValue += numberOfTokens;
      } else if (stat === 'FAILED') {
        failedValue += numberOfTokens;
      } else notDisbursedValue += numberOfTokens;
    });
    return [
      { label: tc('DISBURSED'), value: disbursedValue },
      { label: tg('FAILED'), value: failedValue },
      { label: t('NOT_DISBURSED'), value: notDisbursedValue },
    ];
  };

  return (
    <>
      <Heading
        title={t('TOKENS_OVERVIEW')}
        titleStyle="text-lg"
        description={t('OVERVIEW_OF_YOUR_TOKENS')}
      />
      {!isLoading ? (
        <div className="space-y-4 mb-4">
          {/* First Row - 4 Columns */}
          <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            {/* <DataCard
              className="rounded-sm h-[116px]"
              title="Project Balance"
              smallNumber={`Rs ${formatNum(projectBalance)}`}
              infoIcon={true}
              infoTooltip={'Project Balance'}
              subtitle=" "
            /> */}
            {data?.data?.slice(0, 4).map((item, index) => {
              const isToken = item.name === 'Token';
              const isTokenPrice = item.name === 'Token Price';
              const isBudget = item.name === 'Budget Assigned';
              const infoTooltip = t(getNameKey(item.name) + '_TOOLTIP');

              if (isToken) {
                const assetUrl = getExplorerUrl({
                  chainSettings:
                    settings?.[projectId]?.[
                      PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS
                    ],
                  target: 'asset',
                  value:
                    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CONTRACT]
                      ?.rahattoken?.address,
                });
                return (
                  <a
                    key={index}
                    href={assetUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <DataCard
                      className="rounded-sm h-[116px]"
                      title={t('TOKEN')}
                      smallNumber={formatNum(item.value)}
                      infoIcon={!!infoTooltip}
                      infoTooltip={infoTooltip}
                      subtitle=" "
                    />
                  </a>
                );
              }

              if (isTokenPrice) {
                return (
                  <DataCard
                    key={index}
                    className="rounded-sm h-[116px]"
                    title={t('N1_TOKEN_VALUE')}
                    smallNumber={`Rs ${formatNum(item.value)}`}
                    infoIcon={!!infoTooltip}
                    infoTooltip={infoTooltip}
                    subtitle=" "
                  />
                );
              }

              if (isBudget) {
                return (
                  <DataCard
                    key={index}
                    className="rounded-sm h-[116px]"
                    title={t('BUDGET_ASSIGNED')}
                    smallNumber={`Rs ${formatNum(item.value)}`}
                    infoIcon={!!infoTooltip}
                    infoTooltip={infoTooltip}
                    subtitle=" "
                  />
                );
              }

              return (
                <DataCard
                  key={index}
                  className="rounded-sm h-[116px] p-0"
                  title={t(getNameKey(item.name))}
                  smallNumber={formatNum(item.value)}
                  infoIcon={!!infoTooltip}
                  infoTooltip={infoTooltip}
                    subtitle={
                      item.name === 'Average Duration'
                        ? t('ACTIVATION_TRIGGER_TO_SUCCESSFUL_DISBURSEMENT')
                        : ' '
                    }
                />
              );
            })}
          </div>

          {/* Second Row - 3 Columns */}
          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {data?.data?.slice(4).map((item, index) => {
              const isToken = item.name === 'Token';
              const isTokenPrice = item.name === 'Token Price';
              const isBudget = item.name === 'Budget Assigned';
              const infoTooltip = t(getNameKey(item.name) + '_TOOLTIP');

              // if (isToken) {
              //   return (
              //     <a
              //       key={index}
              //       target="_blank"
              //       href={`https://stellar.expert/explorer/testnet/asset/${item.value}-GCVLRQHGZYG32HZE3PKZ52NX5YFCNFDBUZDLUXQYMRS6WVBWSUOP5IYE-2`}
              //       className="cursor-pointer"
              //     >
              //       <DataCard
              //         className="rounded-sm h-[116px]"
              //         title={item.name}
              //         number={item.value}
              //         infoIcon={!!infoTooltip}
              //         infoTooltip={infoTooltip}
              //         subtitle=" "
              //       />
              //     </a>
              //   );
              // }

              // if (isTokenPrice) {
              //   return (
              //     <DataCard
              //       key={index}
              //       className="rounded-sm h-[116px]"
              //       title="1 Token Value"
              //       number={`Rs ${item.value}`}
              //       infoIcon={!!infoTooltip}
              //       infoTooltip={infoTooltip}
              //       subtitle=" "
              //     />
              //   );
              // }

              // if (isBudget) {
              //   return (
              //     <DataCard
              //       key={index}
              //       className="rounded-sm h-[116px]"
              //       title="Budget Assigned"
              //       number={`Rs ${item.value}`}
              //       infoIcon={!!infoTooltip}
              //       infoTooltip={infoTooltip}
              //       subtitle=" "
              //     />
              //   );
              // }

              return (
                <DataCard
                  key={index}
                  className="rounded-sm h-[116px] p-0"
                  title={t(getNameKey(item.name))}
                  smallNumber={formatNum(item.value)}
                  infoIcon={!!infoTooltip}
                  infoTooltip={infoTooltip}
                    subtitle={
                      item.name === 'Average Duration'
                        ? t('ACTIVATION_TRIGGER_TO_SUCCESSFUL_DISBURSEMENT')
                        : ' '
                    }
                />
              );
            })}
            <DataCard
              className="rounded-sm h-[116px] p-0"
              title={t('PENDING_DISBURSEMENT')}
              smallNumber={formatNum(
                getTokenStat?.tokenStats?.pendingDisbursement,
              ) || '-'}
              infoIcon={true}
              infoTooltip={t('PENDING_DISBURSEMENT_TOOLTIP')}
              subtitle=" "
            />
            <DataCard
              className="rounded-sm h-[116px] p-0"
              title={t('REDEEMED_TOKENS')}
              smallNumber={formatNum(
                getTokenStat?.tokenStats?.redeemedTokens,
              ) || '-'}
              infoIcon={true}
              infoTooltip={t('REDEEMED_TOKENS_TOOLTIP')}
              subtitle=" "
            />
          </div>
        </div>
      ) : (
        <TokenOverviewSkeleton number={[1, 2, 3, 4, 5]} />
      )}
      <div className="flex flex-wrap flex-col xl:flex-row mt-4 gap-4">
        <div className="flex-1 border rounded-sm p-4">
          <h1 className="text-lg font-medium mb-4">{t('TOKEN_STATUS')}</h1>
          <div className="w-full aspect-video">
            <DynamicPieChart
              pieData={tokenStatus()}
              colors={['#2A9D90', '#E53935', '#BDBDBD']}
              options={{
                tooltip: {
                  y: {
                    formatter: (val: number) => formatNum(val),
                  },
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        value: {
                          formatter: (val: number | string) => formatNum(val),
                        },
                        total: {
                          formatter: (w: any) =>
                            formatNum(
                              w.globals.seriesTotals.reduce(
                                (a: number, b: number) => a + b,
                                0,
                              ),
                            ),
                        },
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="flex-[2] border rounded-sm p-4  overflow-hidden">
          <TransactionCard
            cardTitle={t('RECENT_TRANSACTIONS')}
            cardData={groupsFundsData?.data?.filter(
              (item) =>
                item.status !== 'NOT_DISBURSED' && item.status !== 'STARTED',
            )}
            loading={isLoading}
            cardHeight="h-[calc(80vh-350px)]"
          />
        </div>
      </div>
    </>
  );
}
