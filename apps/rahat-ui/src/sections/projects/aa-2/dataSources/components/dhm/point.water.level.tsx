import React from 'react';
import { usePointTableColumns } from '../../columns/usePointTableColumns';
import WaterLevelTable from './table';
import TimeSeriesChart from './chart';

type IProps = {
  waterLevels: any;
  dangerLevel: string;
  warningLevel: string;
};

export default function PointWaterLevel({
  waterLevels,
  dangerLevel,
  warningLevel,
}: IProps) {
  const columns = usePointTableColumns({});

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
