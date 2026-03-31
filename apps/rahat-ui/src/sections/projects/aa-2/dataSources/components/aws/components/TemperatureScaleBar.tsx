interface TemperatureScaleBarProps {
  unit?: string;
  temperatures?: number[];
}

export function TemperatureScaleBar({
  unit = '°C',
  temperatures = [45, 40, 35, 30, 25, 20, 15, 10, 5, 0, -5, -10, -15, -20, -25],
}: TemperatureScaleBarProps) {
  return (
    <div className="flex-shrink-0 bg-white rounded-sm border shadow p-3 w-20">
      <p className="text-xs font-semibold text-gray-700 mb-3 text-center">
        In {unit}
      </p>
      <div className="relative h-[400px]">
        {/* Gradient Bar */}
        <div
          className="absolute inset-0 w-full"
          style={{
            background: `linear-gradient(to bottom,
              #dc2626 0%,
              #ea580c 6.67%,
              #f97316 13.33%,
              #fb923c 20%,
              #fbbf24 26.67%,
              #facc15 33.33%,
              #a3e635 40%,
              #4ade80 46.67%,
              #22c55e 53.33%,
              #06b6d4 60%,
              #0ea5e9 66.67%,
              #3b82f6 73.33%,
              #2563eb 80%,
              #4f46e5 86.67%,
              #7c3aed 93.33%,
              #a855f7 100%
            )`,
          }}
        />

        {/* Temperature Labels */}
        <div className="absolute inset-0 flex flex-col justify-between py-1">
          {temperatures.map((temp) => (
            <div
              key={temp}
              className="text-white text-xs font-semibold text-center leading-none"
            >
              {temp}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
