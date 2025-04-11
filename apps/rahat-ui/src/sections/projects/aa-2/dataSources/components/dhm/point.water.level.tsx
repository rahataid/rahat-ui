import React from 'react';
import { usePointTableColumns } from '../../columns/usePointTableColumns';
import WaterLevelTable from './table';
import TimeSeriesChart from './chart';

type IProps = {
  waterLevels: any;
};

export default function PointWaterLevel({ waterLevels }: IProps) {
  const columns = usePointTableColumns();

  return (
    <div className="grid grid-cols-2 gap-4">
      <TimeSeriesChart data={waterLevels} />
      <WaterLevelTable tableData={waterLevels} columns={columns} />
    </div>
  );
}
