import { useHourlyAndDailyTableColumns } from '../../columns/useHourlyAndDailyTableColumns';
import TimeSeriesChart from './chart';
import WaterLevelTable from './table';

type Iprops = {
  waterLevels: any;
  dangerLevel: string;
  warningLevel: string;
};

export default function HourlyAndDailyWaterLevel({
  waterLevels,
  dangerLevel,
  warningLevel,
}: Iprops) {
  const columns = useHourlyAndDailyTableColumns();

  return (
    <div className="grid grid-cols-2 gap-4">
      <TimeSeriesChart
        data={waterLevels}
        warningLevel={warningLevel}
        dangerLevel={dangerLevel}
      />
      <WaterLevelTable tableData={waterLevels} columns={columns} />
    </div>
  );
}
