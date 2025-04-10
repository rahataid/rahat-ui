import { useHourlyAndDailyTableColumns } from '../../columns/useHourlyAndDailyTableColumns';
import WaterLevelTable from './table';

type Iprops = {
  waterLevels: any;
};

export default function HourlyAndDailyWaterLevel({ waterLevels }: Iprops) {
  const columns = useHourlyAndDailyTableColumns();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-secondary">Chart</div>
      <WaterLevelTable tableData={waterLevels} columns={columns} />
    </div>
  );
}
