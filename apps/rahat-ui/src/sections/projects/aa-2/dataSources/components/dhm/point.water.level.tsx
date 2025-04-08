import React from 'react';
import { usePointTableColumns } from '../../columns/usePointTableColumns';
import ZoomableLineChart from './chart';
import WaterLevelTable from './table';

export default function PointWaterLevel() {
  const [data] = React.useState(() => generateData());

  const series = [
    {
      name: 'My Dynamic Data',
      data: data,
    },
  ];

  const columns = usePointTableColumns();

  const pointTableData = [
    { date: new Date().toLocaleString(), point: '1.96' },
    { date: new Date().toLocaleString(), point: '1.96' },
  ];

  function generateData(): [number, number][] {
    const base = new Date('2023-01-01').getTime();
    const data: [number, number][] = [];
    for (let i = 0; i < 100; i++) {
      data.push([base + i * 86400000, Math.floor(Math.random() * 100)]);
    }
    return data;
  }
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-secondary">
        <ZoomableLineChart series={series} title="Custom Zoom Chart" />
      </div>
      <WaterLevelTable tableData={pointTableData} columns={columns} />
    </div>
  );
}
