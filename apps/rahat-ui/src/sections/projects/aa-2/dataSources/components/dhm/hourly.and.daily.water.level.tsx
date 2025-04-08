import { useHourlyAndDailyTableColumns } from '../../columns/useHourlyAndDailyTableColumns';
import WaterLevelTable from './table';

export default function HourlyAndDailyWaterLevel() {
  const columns = useHourlyAndDailyTableColumns();

  const hourlyAndDailyTableData = [
    {
      date: new Date().toLocaleString(),
      min: '1.96',
      max: '2.00',
      average: '1.98',
    },
    {
      date: new Date().toLocaleString(),
      min: '1.96',
      max: '2.00',
      average: '1.98',
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-secondary">Chart</div>
      <WaterLevelTable tableData={hourlyAndDailyTableData} columns={columns} />
    </div>
  );
}
