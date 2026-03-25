import React from 'react';

type SimpleBarProps = {
  values: number[];
  colors?: string[];
  height?: number | string;
};

const DEFAULT_COLORS = [
  '#297AD6', // blue
  '#E8C468', // yellow
  '#4CAF50', // green
  '#F44336', // red
  '#9C27B0', // purple
  '#00BCD4', // cyan
  '#FF9800', // orange
];

export function SimpleHorizontalBar({
  values,
  colors = DEFAULT_COLORS,
  height = 16,
}: SimpleBarProps) {
  const total = values.reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <div className="w-full rounded-full bg-gray-200 mb-4" style={{ height }} />
    );
  }

  return (
    <div
      className="w-full rounded-full bg-gray-200 flex overflow-hidden mb-4"
      style={{ height }}
    >
      {values.map((val, i) => {
        const widthPercent = (val / total) * 100;
        return (
          <div
            key={i}
            style={{
              width: `${widthPercent}%`,
              background: colors[i % colors.length],
              height: '100%',
              transition: 'width 0.3s',
            }}
          />
        );
      })}
    </div>
  );
}
