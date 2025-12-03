// import { dFMTransactionsData } from '../static';
import {
  PROJECT_SETTINGS_KEYS,
  useFetchTokenStatsStellar,
  useGroupsReservedFunds,
  usePagination,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import { DataCard, Heading, TransactionCard } from 'apps/rahat-ui/src/common';
import { INFO_TOOL_TIPS } from 'apps/rahat-ui/src/constants/aa.constants';
import { useChains } from 'connectkit';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import TokenOverviewSkeleton from './token.overview.skeleton';
import DynamicPieChart from '../../../components/dynamicPieChart';

export default function TokensOverview() {
  const uuid = useParams().id;
  const projectId = uuid as UUID;
  const { data, isLoading } = useFetchTokenStatsStellar({
    projectUUID: uuid as '${string}-${string}-${string}-${string}-${string}',
  });
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
      { label: 'Disbursed', value: disbursedValue },
      { label: 'Failed', value: failedValue },
      { label: 'Not Disbursed', value: notDisbursedValue },
    ];
  };

  return (
    <>
      <Heading
        title="Tokens Overview"
        titleStyle="text-lg"
        description="Overview of your tokens"
      />
      {!isLoading ? (
        <div className="space-y-4 mb-4">
          {/* First Row - 4 Columns */}
          <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            {data?.data?.slice(0, 4).map((item, index) => {
              const isToken = item.name === 'Token';
              const isTokenPrice = item.name === 'Token Price';
              const isBudget = item.name === 'Budget Assigned';
              const infoTooltip = INFO_TOOL_TIPS[item.name];

              if (isToken) {
                return (
                  <a
                    key={index}
                    href={`https://stellar.expert/explorer/${
                      settings?.[projectId]?.[
                        PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS
                      ]?.['network'] === 'mainnet'
                        ? 'public'
                        : 'testnet'
                    }/asset/${
                      item.value
                    }-GCVLRQHGZYG32HZE3PKZ52NX5YFCNFDBUZDLUXQYMRS6WVBWSUOP5IYE-2`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <DataCard
                      className="rounded-sm h-[116px]"
                      title={item.name}
                      smallNumber={item.value}
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
                    title="1 Token Value"
                    smallNumber={`Rs ${item.value}`}
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
                    title="Budget Assigned"
                    smallNumber={`Rs ${item.value}`}
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
                  title={item.name}
                  smallNumber={String(item.value)}
                  infoIcon={!!infoTooltip}
                  infoTooltip={infoTooltip}
                  subtitle={
                    item.name === 'Average Duration'
                      ? 'Activation Trigger to Successful Disbursement'
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
              const infoTooltip = INFO_TOOL_TIPS[item.name];

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
                  title={item.name}
                  smallNumber={String(item.value)}
                  infoIcon={!!infoTooltip}
                  infoTooltip={infoTooltip}
                  subtitle={
                    item.name === 'Average Duration'
                      ? 'Activation Trigger to Successful Disbursement'
                      : ' '
                  }
                />
              );
            })}
          </div>
        </div>
      ) : (
        <TokenOverviewSkeleton number={[1, 2, 3, 4, 5]} />
      )}
      <div className="flex flex-wrap flex-col xl:flex-row mt-4 gap-4">
        <div className="flex-1 border rounded-sm p-4">
          <h1 className="text-lg font-medium mb-4">Token Status</h1>
          <div className="w-full aspect-video">
            <DynamicPieChart
              pieData={tokenStatus()}
              colors={['#2A9D90', '#E53935', '#BDBDBD']}
            />
          </div>
        </div>

        <div className="flex-[2] border rounded-sm p-4  overflow-hidden">
          <TransactionCard
            cardTitle="Recent Transactions"
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
