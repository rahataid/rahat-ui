import {
  useCambodiaLineChartsReports,
  useCambodiaVendorsStats,
  useGetProjectDatasource,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import {
  BadgeCheck,
  Banknote,
  Coins,
  Eye,
  Glasses,
  Stethoscope,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { cn } from '@rahat-ui/shadcn/src/utils';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import MONTHS from '../../../utils/months.json';
import { DynamicReports } from '../../chart-reports';
import CambodiaLineCharts from '../../chart-reports/cambodia-line-chart';
import DropdownComponent from '../components/dropdownComponent';

type CambodiaProgramVendorStatsPayload = {
  consumers?: number;
  healthWorkers?: number;
  leadsRecieved?: number;
  leadsConverted?: number;
  totalEyewearSold?: number;
  totalPurchaseAmountRmb?: number;
};

export default function ProjectDetail() {
  const currentYear = new Date().getFullYear();
  const START_YEAR = 2025;

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthName = MONTHS.find(
    (month) => month.value === currentMonth.toString(),
  );
  const [filters, setFilters] = React.useState({
    month: currentMonth,
    year: currentYear,
  });
  const { id } = useParams() as { id: UUID };
  const { data: newDatasource } = useGetProjectDatasource(id);

  const { data: appStatsRaw, isFetching: appStatsFetching } =
    useCambodiaVendorsStats({ projectUUID: id });
  const appStats = appStatsRaw?.data as
    | CambodiaProgramVendorStatsPayload
    | undefined;

  const handleSelect = (key: string, value: string) => {
    if (key === 'Months') {
      setFilters({ ...filters, month: parseInt(value) });
    }
    if (key === 'Years') {
      setFilters({ ...filters, year: parseInt(value) });
    }
  };

  const { data: lineChartReport } = useCambodiaLineChartsReports({
    projectUUID: id,
    filters,
  });

  const transformedYearData = Array.from(
    { length: currentYear + 5 - START_YEAR + 1 },
    (_, index) => {
      const year = START_YEAR + index;
      return { label: year.toString(), value: year.toString() };
    },
  );
  const transformedMonthData = MONTHS.map((item) => ({
    label: item.label.toString(),
    value: item.value.toString(),
  }));

  const rmbAmount = appStats?.totalPurchaseAmountRmb ?? 0;
  const rmbDisplay =
    typeof rmbAmount === 'number'
      ? rmbAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : String(rmbAmount);

  const dataCardToneProps = {
    className:
      'rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]',
    titleClassName: 'text-sm font-medium text-muted-foreground',
    cardHeaderClassName: 'px-5 pb-2 pt-5',
    cardContentClassName: 'px-5 pb-5 pt-0',
    numberClassName: 'text-2xl font-semibold tracking-tight text-foreground',
  } as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Overview
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Program-wide stats and activity across all Eye Partners.
        </p>
      </div>

      <div
        className={cn(
          'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
          appStatsFetching && 'opacity-70 transition-opacity duration-200',
        )}
      >
        <DataCard
          {...dataCardToneProps}
          title="Total Eye Partners"
          Icon={Eye}
          number={String(appStats?.consumers ?? 0)}
        />
        <DataCard
          {...dataCardToneProps}
          title="Total Village Doctors"
          Icon={Stethoscope}
          number={String(appStats?.healthWorkers ?? 0)}
        />
        <DataCard
          {...dataCardToneProps}
          title="Total Number of Villagers Referred"
          Icon={Users}
          number={String(appStats?.leadsRecieved ?? 0)}
        />
        <DataCard
          {...dataCardToneProps}
          title="Total Number of Successful Referrals in Eye Partners"
          Icon={UserCheck}
          number={String(appStats?.leadsConverted ?? 0)}
        />
        <DataCard
          {...dataCardToneProps}
          title="Total Eyewear Sold in Eye Partners"
          Icon={Glasses}
          number={String(appStats?.totalEyewearSold ?? 0)}
        />
        <DataCard
          {...dataCardToneProps}
          title="Total Sales in Eye Partners (RMB)"
          Icon={Coins}
          number={rmbDisplay}
        />
      </div>

      {newDatasource &&
        newDatasource[0]?.data &&
        newDatasource[0]?.data?.ui.length && (
          <DynamicReports
            dataSources={newDatasource[0]?.data?.dataSources}
            ui={newDatasource[0]?.data?.ui}
          />
        )}

      <Card className="flex flex-col overflow-hidden border border-border/80 shadow-sm shadow-black/[0.03]">
        <CardHeader className="border-b border-border/80 px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Data overview
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Visualize referrals, disbursements, and program activity across
                the selected period.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap gap-2 lg:justify-end">
              <DropdownComponent
                transformedData={transformedMonthData}
                title={'Months'}
                handleSelect={handleSelect}
                current={currentMonthName?.label}
              />
              <DropdownComponent
                transformedData={transformedYearData}
                title={'Years'}
                handleSelect={handleSelect}
                current={currentYear}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-5 pt-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {lineChartReport?.data?.map((item) => (
              <CambodiaLineCharts
                series={item?.series}
                categories={item?.categories}
                name={item?.name}
                key={item.name}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
