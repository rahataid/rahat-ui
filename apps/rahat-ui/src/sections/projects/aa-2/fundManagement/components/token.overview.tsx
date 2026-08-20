// import { dFMTransactionsData } from '../static';
import {
  PROJECT_SETTINGS_KEYS,
  useFetchTokenStatsStellar,
  useFundAssignmentStore,
  useGroupsReservedFunds,
  usePagination,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import {
  DataCard,
  Heading,
  IconLabelBtn,
  TransactionCard,
} from 'apps/rahat-ui/src/common';
import { INFO_TOOL_TIPS } from 'apps/rahat-ui/src/constants/aa.constants';
import { useChains } from 'connectkit';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import TokenOverviewSkeleton from './token.overview.skeleton';
import DynamicPieChart from '../../../components/dynamicPieChart';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import { useProjectBalance } from 'apps/rahat-ui/src/hooks/aa/utils';
import { CloudDownloadIcon } from 'lucide-react';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { exportTokenStats, hasTokenData } from '../utils/token.utils';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useTranslations } from 'next-intl';
import { useChartNumberOptions } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

export default function TokensOverview() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const tc = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const uuid = useParams().id;
  const projectId = uuid as UUID;
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const { data, isLoading } = useFetchTokenStatsStellar({
    projectUUID: uuid,
    startDate,
    endDate,
  });

  // const { data: getTokenStat } = useProjectDashboardReporting(projectId);

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
  const { formatNum, chartOptions } = useChartNumberOptions();

  const getNameKey = (name: string) =>
    name === 'Token Price' ? 'TOKEN_PRICE' :
    name === 'Average Disbursement time' ? 'AVERAGE_DISBURSEMENT_TIME' :
    name === 'Average Duration' ? 'AVERAGE_DURATION' :
    name.toUpperCase().replace(/[\s-]+/g, '_');

  // Stat names come from the backend, so a newly added stat may not have a
  // translation key yet. t() throws on a missing key and would crash the page,
  // so fall back to the raw backend label / no tooltip instead.
  const statTitle = (name: string) =>
    translateValue(t, getNameKey(name), { fallback: name });

  const statTooltip = (name: string) =>
    translateValue(t, `${getNameKey(name)}_TOOLTIP`, {
      fallback: INFO_TOOL_TIPS[name] ?? '',
    });

  // Some stats (e.g. Average Duration) send the literal string "N/A" from
  // the backend instead of a number when there's no data to average yet --
  // formatNum only converts digits, so it passes "N/A" through untranslated.
  const formatStatValue = (value: unknown) =>
    value === 'N/A' ? tg('N_A') : formatNum(value);

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
  const handleDateChange = (range: any) => {
    if (range?.from && range?.to) {
      setStartDate(range.from.toISOString());
      setEndDate(range.to.toISOString());
    }
  };

  const handleClearDate = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };
  const hasData = hasTokenData(data);
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={t('TOKENS_OVERVIEW')}
          titleStyle="text-lg"
          description={t('OVERVIEW_OF_YOUR_TOKENS')}
        />
        <div className="flex gap-2 items-center">
          <TooltipWrapper
            tip={hasData ? '' : tg('NO_TOKEN_DATA_TO_EXPORT')}
          >
            <IconLabelBtn
              Icon={CloudDownloadIcon}
              handleClick={() => exportTokenStats(data)}
              name={tg('EXPORT_REPORT')}
              variant="outline"
              disabled={!hasData}
              className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
            />
          </TooltipWrapper>
          <DateRangePicker
            placeholder={tg('PICK_DATE_RANGE')}
            handleDateChange={handleDateChange}
            handleClearDate={handleClearDate}
            type="range"
            className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
          />
        </div>
      </div>

      {!isLoading ? (
        <div className="space-y-4 mb-4">
          {/* First Row - 4 Columns */}
          <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            {/* <DataCard
              className="rounded-sm h-[116px]"
              title="Project Balance"
              smallNumber={`${t('RS')} ${formatNum(projectBalance)}`}
              infoIcon={true}
              infoTooltip={'Project Balance'}
              subtitle=" "
            /> */}
            {data?.data?.slice(0, 4).map((item, index) => {
              const isToken = item.name === 'Token';
              const isTokenPrice = item.name === 'Token Price';
              const isBudget = item.name === 'Budget Assigned';
              const infoTooltip = statTooltip(item.name);

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
                      smallNumber={formatStatValue(item.value)}
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
                    smallNumber={`${t('RS')} ${formatNum(item.value)}`}
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
                    smallNumber={`${t('RS')} ${formatNum(item.value)}`}
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
                  title={statTitle(item.name)}
                  smallNumber={formatStatValue(item.value)}
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
              const infoTooltip = statTooltip(item.name);

              return (
                <DataCard
                  key={index}
                  className="rounded-sm h-[116px] p-0"
                  title={statTitle(item.name)}
                  smallNumber={formatStatValue(item.value)}
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
                tooltip: chartOptions.tooltip,
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        value: {
                          formatter: (val: number | string) => formatNum(val),
                        },
                        total: {
                          label: t('TOTAL'),
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
