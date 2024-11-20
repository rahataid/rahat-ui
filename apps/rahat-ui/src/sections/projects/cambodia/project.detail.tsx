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
import SearchDropdownComponent from '../components/searchDropdownComponent';

export default function ProjectDetail() {
  const currentYear = new Date().getFullYear();

  const currentMonth = new Date().getMonth() + 1;
  const currentMonthName = MONTHS.find(
    (month) => month.value === currentMonth.toString(),
  );
  const [filters, setFilters] = React.useState({
    month: currentMonth,
    year: currentYear,
  });
  const { id } = useParams() as { id: UUID };
  const newDatasource = useGetProjectDatasource(id);

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
  const transformedYearData = Array.from({ length: 5 }, (_, index) => {
    const year = currentYear + index;
    return {
      label: year.toString(),
      value: year.toString(),
    };
  });
  const transformedMonthData =
    MONTHS.map((item) => ({
      label: item.label.toString(),
      value: item.value.toString(),
    })) || [];

  return (
    <>
      {newDatasource?.data && newDatasource?.data[0]?.data?.ui.length && (
        <>
          <DynamicReports
            dataSources={newDatasource?.data[0]?.data?.dataSources}
            ui={newDatasource?.data[0]?.data?.ui}
          />

          <div className="flex flex-row mt-4 mb-4 justify-between">
            <div>
              <h1 className="font-semibold text-[18px] mb-2">Data Overview</h1>
              <p className="text-muted-foreground text-base">
                This section provides the visualization of the system data
              </p>
            </div>

            <div>
              <SearchDropdownComponent
                transformedData={transformedMonthData}
                title={'Months'}
                handleSelect={handleSelect}
                current={currentMonthName?.label}
              />
              <SearchDropdownComponent
                transformedData={transformedYearData}
                title={'Year'}
                handleSelect={handleSelect}
                current={currentYear}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {lineChartReport?.data?.map((item) => (
              <CambodiaLineCharts
                series={item?.series}
                categories={item?.categories}
                name={item?.name}
                key={item.name}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
