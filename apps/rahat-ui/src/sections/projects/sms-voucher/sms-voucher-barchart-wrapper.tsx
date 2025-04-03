import { BarChart } from '@rahat-ui/shadcn/src/components/charts';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DropdownComponent from '../components/dropdownComponent';
import React from 'react';
import MONTHS from '../../../utils/months.json';
import SmsVoucherLineCharts from '../../chart-reports/sms-voucher-line-chart';
import {
  useEyeCheckupLineChartsReports,
  usePurchaseOfGlassLineChartsReports,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

type BarChartData = {
  component: any;
  actualData: any;
};

const BarChartWrapper = ({ actualData, component }: BarChartData) => {
  const barData = actualData?.find((d: any) => d.name === component?.dataMap);

  const categories = barData?.data.map((b: any) => b.id);
  const series = barData?.data.map((b: any) => b.count);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const currentMonthName = MONTHS.find(
    (month) => month.value === currentMonth.toString(),
  );

  const [eyeCheckupFilters, setEyeCheckupFilters] = React.useState({
    month: currentMonth,
    year: currentYear,
  });

  const [purchaseFilters, setPurchaseFilters] = React.useState({
    month: currentMonth,
    year: currentYear,
  });

  const { id } = useParams() as { id: UUID };

  // Fetch data with separate filters
  const { data: purchaseOfGlassReport } = usePurchaseOfGlassLineChartsReports({
    projectUUID: id,
    filters: purchaseFilters,
  });

  const { data: eyeCheckUpReport } = useEyeCheckupLineChartsReports({
    projectUUID: id,
    filters: eyeCheckupFilters,
  });

  const handleSelect = (
    key: string,
    value: string,
    type: 'eyeCheckup' | 'purchase',
  ) => {
    if (type === 'eyeCheckup') {
      setEyeCheckupFilters((prev) => ({
        ...prev,
        [key.toLowerCase()]: parseInt(value),
      }));
    } else if (type === 'purchase') {
      setPurchaseFilters((prev) => ({
        ...prev,
        [key.toLowerCase()]: parseInt(value),
      }));
    }
  };

  const transformedYearData = Array.from({ length: 5 }, (_, index) => {
    const year = currentYear + index;
    return { label: year.toString(), value: year.toString() };
  });

  const transformedMonthData =
    MONTHS.map((item) => ({
      label: item.label.toString(),
      value: item.value.toString(),
    })) || [];

  if (categories && series)
    return (
      <div className="bg-card rounded-sm p-4 shadow-md">
        <p className="text-md font-medium mb-4">{component?.title}</p>
        <div className="flex items-end justify-center gap-4 w-full ">
          {/* Bar Chart */}
          <div className="flex-1 flex flex-col bg-white p-4 rounded-lg shadow-md">
            <BarChart
              categories={categories}
              series={series}
              xaxisLabels={component?.props?.xaxisLabels}
              horizontal={component?.props?.horizontal}
              // className="w-full h-full"
            />
          </div>

          {/* Eye Checkup Report */}
          <div className="flex-1 flex flex-col bg-white   rounded-lg shadow-md">
            <div className="flex justify-between items-center ">
              <h1 className="text-md font-medium">
                {eyeCheckUpReport?.data?.name}
              </h1>
              <div className="flex gap-2">
                <DropdownComponent
                  transformedData={transformedMonthData}
                  title="Month"
                  handleSelect={(key, value) =>
                    handleSelect(key, value, 'eyeCheckup')
                  }
                  current={currentMonthName?.label}
                  className="w-[100px]"
                />
                <DropdownComponent
                  transformedData={transformedYearData}
                  title="Year"
                  handleSelect={(key, value) =>
                    handleSelect(key, value, 'eyeCheckup')
                  }
                  current={eyeCheckupFilters.year.toString()}
                  className="w-[100px]"
                />
              </div>
            </div>
            <div className="flex-1 h-[400px]">
              <SmsVoucherLineCharts
                series={eyeCheckUpReport?.data?.series}
                categories={eyeCheckUpReport?.data?.categories}
                name={eyeCheckUpReport?.data?.name}
                key={eyeCheckUpReport?.data?.name}
              />
            </div>
          </div>

          {/* Purchase of Glass Report */}
          <div className="flex-1 flex flex-col bg-white  rounded-lg shadow-md">
            <div className="flex justify-between items-center ">
              <h1 className="text-md font-medium">
                {purchaseOfGlassReport?.data?.name}
              </h1>
              <div className="flex gap-2">
                <DropdownComponent
                  transformedData={transformedMonthData}
                  title="Month"
                  handleSelect={(key, value) =>
                    handleSelect(key, value, 'purchase')
                  }
                  current={currentMonthName?.label}
                  className="w-[100px]"
                />
                <DropdownComponent
                  transformedData={transformedYearData}
                  title="Year"
                  handleSelect={(key, value) =>
                    handleSelect(key, value, 'purchase')
                  }
                  current={purchaseFilters.year.toString()}
                  className="w-[100px]"
                />
              </div>
            </div>
            <div className="flex-1">
              <SmsVoucherLineCharts
                series={purchaseOfGlassReport?.data?.series}
                categories={purchaseOfGlassReport?.data?.categories}
                name={purchaseOfGlassReport?.data?.name}
                key={purchaseOfGlassReport?.data?.name}
              />
            </div>
          </div>
        </div>
      </div>
    );
};

export default BarChartWrapper;
