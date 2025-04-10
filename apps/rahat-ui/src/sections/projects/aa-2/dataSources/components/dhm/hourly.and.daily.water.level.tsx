import { useHourlyAndDailyTableColumns } from '../../columns/useHourlyAndDailyTableColumns';
import TimeSeriesChart from './chart';
import WaterLevelTable from './table';

type Iprops = {
  waterLevels: any;
};

export default function HourlyAndDailyWaterLevel({ waterLevels }: Iprops) {
  const series = [
    {
      name: 'Water Level',
      data: waterLevels?.map((item: any) => [
        new Date(item.datetime).getTime(),
        item.value,
      ]),
    },
  ];

  const columns = useHourlyAndDailyTableColumns();

  return (
    <div className="grid grid-cols-2 gap-4">
      <TimeSeriesChart series={series} />
      <WaterLevelTable tableData={waterLevels} columns={columns} />
    </div>
  );
}
