import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

interface IGlofasHydrographChartProps {
  series: { date: string; min: number; max: number; mean: number }[];
}

const GlofasHydrographChart = ({ series }: IGlofasHydrographChartProps) => {
  if (!series?.length) return null;

  const chartData = series.map((d) => ({
    ...d,
    date: dateFormat(d.date, 'MMM dd'),
    range: [d.min, d.max],
  }));

  return (
    <div className="bg-card overflow-hidden p-4 border shadow rounded-sm mt-4">
      <h1 className="font-semibold text-lg mb-4">Discharge Forecast (m³/s)</h1>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area
            dataKey="range"
            name="Min-Max range"
            stroke="none"
            fill="#93c5fd"
            fillOpacity={0.4}
          />
          <Line
            dataKey="mean"
            name="Mean discharge"
            stroke="#1d4ed8"
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GlofasHydrographChart;
