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
        <div className="absolute inset-0 w-full bg-[linear-gradient(to_bottom,rgb(220_38_38)_0%,rgb(234_88_12)_6.67%,rgb(249_115_22)_13.33%,rgb(251_146_60)_20%,rgb(251_191_36)_26.67%,rgb(250_204_21)_33.33%,rgb(163_230_53)_40%,rgb(74_222_128)_46.67%,rgb(34_197_94)_53.33%,rgb(6_182_212)_60%,rgb(14_165_233)_66.67%,rgb(59_130_246)_73.33%,rgb(37_99_235)_80%,rgb(79_70_229)_86.67%,rgb(124_58_237)_93.33%,rgb(168_85_247)_100%)]" />

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
