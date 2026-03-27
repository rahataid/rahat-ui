import React, { useState } from 'react';

type SimpleBarProps = {
  values: number[];
  colors?: string[];
  height?: number | string;
  labels?: string[];
};

const DEFAULT_COLORS = [
  '#297AD6',
  '#E8C468',
  '#4CAF50',
  '#F44336',
  '#9C27B0',
  '#00BCD4',
  '#FF9800',
];

export function SimpleHorizontalBar({
  values,
  colors = DEFAULT_COLORS,
  height = 16,
  labels = ['Mandatory', 'Optional'],
}: SimpleBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipX, setTooltipX] = useState(0);

  const total = values.reduce((a, b) => a + b, 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.parentElement!.getBoundingClientRect();
    setTooltipX(e.clientX - rect.left);
  };

  if (total === 0) {
    return (
      <div className="w-full mb-2">
        <div className="flex gap-2 items-center justify-center  mt-4">
          <span className="text-2xl font-medium text-blue-500">0</span>
          <span className="text-sm text-gray-600">Total Triggers</span>
        </div>
        <div className="w-full rounded-full bg-gray-200" style={{ height }} />
      </div>
    );
  }

  return (
    <div className="w-full  mb-2">
      {/* Header */}
      <div className="flex gap-2 items-center justify-center mt-4 ">
        <span className="text-2xl font-medium text-blue-500">{total}</span>
        <span className="text-sm text-gray-600">Total Triggers</span>
      </div>

      {/* Bar */}
      <div className="relative w-full ">
        <div
          className="w-full rounded-full flex overflow-hidden "
          style={{ height }}
        >
          {values.map((val, i) => {
            const widthPercent = (val / total) * 100;
            const isHovered = hoveredIndex === i;
            const baseColor = colors[i % colors.length];

            return (
              <div
                key={i}
                style={{
                  width: `${widthPercent}%`,
                  background: baseColor,
                  height: '100%',
                  opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1,
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </div>

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-10 px-3 py-1.5 rounded-[6px] text-white text-sm font-medium pointer-events-none"
            style={{
              background: colors[hoveredIndex % colors.length],
              top: Number(height) + 8,
              left: Math.min(tooltipX, 200),
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {labels[hoveredIndex] ?? `Segment ${hoveredIndex + 1}`}:{' '}
            <span className="font-bold">{values[hoveredIndex]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
