import React from 'react';
import { usePointTableColumns } from '../../columns/usePointTableColumns';
import WaterLevelTable from './table';
import TimeSeriesChart from './chart';

type IProps = {
  waterLevels: any;
};

export default function PointWaterLevel({ waterLevels }: IProps) {
  const series = [
    {
      name: 'Water Level',
      data: waterLevels?.map((item: any) => [
        new Date(item.datetime).getTime(),
        item.value,
      ]),
    },
  ];

  const columns = usePointTableColumns();

  return (
    <div className="grid grid-cols-2 gap-4">
      <TimeSeriesChart series={series} />
      <WaterLevelTable tableData={waterLevels} columns={columns} />
    </div>
  );
}
