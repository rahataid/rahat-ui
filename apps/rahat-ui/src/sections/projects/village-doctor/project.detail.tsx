import {
  useCambodiaLineChartsReports,
  useGetProjectDatasource,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import MONTHS from '../../../utils/months.json';
import { DynamicReports } from '../../chart-reports';
import CambodiaLineCharts from '../../chart-reports/cambodia-line-chart';
import DropdownComponent from '../components/dropdownComponent';
import SpinnerLoader from '../components/spinner.loader';

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
  const { data: newDatasource, isLoading } = useGetProjectDatasource(id);

  const handleSelect = (key: string, value: string) => {
    if (key === 'Months') {
      setFilters({ ...filters, month: parseInt(value) });
    }
    if (key === 'Years') {
      setFilters({ ...filters, year: parseInt(value) });
    }
  };

  const { data: lineChartReport, isLoading: lineChartLoading } =
    useCambodiaLineChartsReports({
      projectUUID: id,
      filters,
    });
  const transformedYearData = Array.from(
    { length: currentYear + 5 - START_YEAR + 1 },
    (_, index) => {
      const year = START_YEAR + index;
      return {
        label: year.toString(),
        value: year.toString(),
      };
    },
  );
  const transformedMonthData =
    MONTHS.map((item) => ({
      label: item.label.toString(),
      value: item.value.toString(),
    })) || [];

  if (isLoading && lineChartLoading) {
    return (
      <div className="flex justify-center items-center">
        <SpinnerLoader />
      </div>
    );
  }
  return (
    <>
      {newDatasource &&
        newDatasource[0]?.data &&
        newDatasource[0]?.data?.ui.length && (
          <>
            <DynamicReports
              dataSources={newDatasource[0]?.data?.dataSources}
              ui={newDatasource[0]?.data?.ui}
            />
          </>
        )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Data overview
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Visualize referrals, disbursements, and program activity across the
            selected period.
          </p>
        </div>

        <div className="flex flex-shrink-0 flex-wrap gap-2 sm:justify-end">
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {lineChartReport?.data?.map((item) => {
          return (
            <CambodiaLineCharts
              series={item?.series}
              categories={item?.categories}
              name={item?.name}
              key={item.name}
            />
          );
        })}
      </div>
    </>
  );
}
