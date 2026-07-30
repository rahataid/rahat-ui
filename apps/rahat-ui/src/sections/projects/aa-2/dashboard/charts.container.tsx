import { BarChart, ChartDonut } from '@rahat-ui/shadcn/src/components/charts';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { useTranslations } from 'next-intl';
import PieChartCard from '../../components/pie.chart.card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

type IProps = {
  allStats: any;
};

export default function ChartsContainer({ allStats = [] }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const genderStats = allStats?.filter(
    (data: any) => data.name === 'BENEFICIARY_GENDER',
  )[0]?.data;

  const vulnerableStatusStats = allStats
    ?.filter((data: any) => data.name === 'BENEFICIARY_VULNERABILITYSTATUS')[0]
    ?.data?.map((item: any) => ({ label: item.id, value: item.count }));

  const bankStatusStats = allStats
    ?.filter((data: any) => data.name === 'BENEFICIARY_BANKSTATUS')[0]
    ?.data?.map((item: any) => ({ label: item.id, value: item.count }));

  const phoneTypeStats = allStats
    ?.filter((data: any) => data.name === 'BENEFICIARY_PHONETYPE')[0]
    ?.data?.map((item: any) => ({ label: item.id, value: item.count }));

  const phoneStatusStats = allStats
    ?.filter((data: any) => data.name === 'BENEFICIARY_PHONESTATUS')[0]
    ?.data?.map((item: any) => ({ label: item.id, value: item.count }));

  const countByBankStats = allStats?.filter(
    (data: any) => data.name === 'BENEFICIARY_COUNTBYBANK',
  )[0]?.data;

  const chartAxOptions = {
    xaxis: {
      labels: {
        formatter: (val: number) => formatNum(val),
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatNum(val),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatNum(val),
      },
    },
  };

  const pieChartData = [
    {
      title: t('HOUSEHOLD_PHONE_AVAILABILITY'),
      series: phoneStatusStats,
      colors: ['#5258E0', '#E0CA52'],
    },
    {
      title: t('HOUSEHOLD_BANK_STATUS'),
      series: bankStatusStats,
      colors: ['#4CAF50', '#E0CA52'],
    },
    {
      title: t('TYPE_OF_PHONE'),
      series: phoneTypeStats,
      colors: ['#5258E0', '#4CAF50'],
    },
  ];
  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-2">
        {/* Donut Chart : Gender Start  */}
        {genderStats && (
          <div className="rounded-sm bg-card p-4 border shadow-sm">
            <h1 className="text-md font-medium mb-4">
              {t('CASH_SUPPORTED_HOUSEHOLDS_BY_GENDER')}
            </h1>
            <div className="flex justify-center">
              <ChartDonut
                labels={genderStats?.map((gender: any) => gender.id)}
                series={genderStats?.map((gender: any) => gender.count)}
                donutSize="70%"
                width={360}
                height={290}
                options={chartAxOptions}
              />
            </div>
          </div>
        )}
        {/* Donut Chart : Gender End  */}

        {/* Bar Chart : Vulnerability Status Start  */}
        <div className="rounded-sm bg-card border shadow-sm">
          <div className="p-4">
            <h1 className="text-md font-medium mb-1">{t('VULNERABILITY_STATUS')}</h1>
            <p className="text-primary font-semibold text-2xl">
              {formatNum(vulnerableStatusStats?.length ?? 0)}
            </p>
          </div>
          <Separator />
          <div className="flex justify-center">
            <BarChart
              series={vulnerableStatusStats?.map((item: any) => item.value)}
              categories={vulnerableStatusStats?.map((item: any) => item.label)}
              horizontal={true}
              colors={['#eab308']}
              xaxisLabels={false}
              barHeight={30}
              height={280}
              options={chartAxOptions}
            />
          </div>
        </div>
        {/* Bar Chart : Vulnerability Status End  */}

        {/* Bar Chart : Beneficiary Associated Bank Start  */}
        {countByBankStats && (
          <div className="rounded-sm bg-card border shadow-sm">
            <div className="p-4">
              <h1 className="text-md font-medium mb-1">
                {t('BENEFICIARY_ASSOCIATED_BANK')}
              </h1>
              <p className="text-primary font-semibold text-2xl">
                {formatNum(countByBankStats?.length ?? 0)}
              </p>
            </div>
            <Separator />
            <ScrollArea className="h-[280px]">
              <div className="flex justify-center">
                <BarChart
                  series={countByBankStats?.map((item: any) => item.count)}
                  categories={countByBankStats?.map((item: any) => item.id)}
                  horizontal={true}
                  colors={['#2563eb']}
                  xaxisLabels={false}
                  yaxisLabels={countByBankStats?.length > 0 ? true : false}
                  barHeight={15}
                  width={450}
                  height={countByBankStats?.length > 10 ? 500 : 265}
                  options={chartAxOptions}
                />
              </div>
            </ScrollArea>
          </div>
        )}
        {/* Bar Chart : Beneficiary Associated Bank End  */}
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${pieChartData.length} gap-4 p-2`}
      >
        {pieChartData.map(
          (chart, index) =>
            chart?.series && (
              <PieChartCard
                key={index}
                title={chart.title}
                series={chart.series}
                colors={chart.colors}
                style="border shadow-sm"
                options={chartAxOptions}
              />
            ),
        )}
      </div>
    </>
  );
}
