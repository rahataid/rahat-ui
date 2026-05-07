'use client';

import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
interface ColorLegendProps {
  selectedLayerId: string;
}

// Define legend configurations for different layer types
const legendConfigs: Record<
  string,
  {
    unit: string;
    gradient: string;
    stops: { value: number; color: string }[];
  }
> = {
  temperature: {
    unit: '°C',
    gradient:
      'linear-gradient(to bottom, #8B0000, #FF0000, #FF4500, #FFA500, #FFD700, #FFFF00, #90EE90, #00FF00, #00FFFF, #4169E1, #0000FF, #4B0082, #8B008B)',
    stops: [
      { value: 45, color: '#8B0000' },
      { value: 40, color: '#FF0000' },
      { value: 35, color: '#FF4500' },
      { value: 30, color: '#FFA500' },
      { value: 25, color: '#FFD700' },
      { value: 20, color: '#FFFF00' },
      { value: 15, color: '#90EE90' },
      { value: 10, color: '#00FF00' },
      { value: 5, color: '#00FFFF' },
      { value: 0, color: '#4169E1' },
      { value: -5, color: '#0000FF' },
      { value: -10, color: '#4B0082' },
      { value: -15, color: '#8B008B' },
      { value: -20, color: '#800080' },
      { value: -25, color: '#FF00FF' },
    ],
  },
  precipitation: {
    unit: 'mm',
    gradient:
      'linear-gradient(to bottom, #8B0000, #FF0000, #FFA500, #FFFF00, #90EE90, #00FFFF, #0000FF)',
    stops: [
      { value: 100, color: '#8B0000' },
      { value: 80, color: '#FF0000' },
      { value: 60, color: '#FFA500' },
      { value: 40, color: '#FFFF00' },
      { value: 20, color: '#90EE90' },
      { value: 10, color: '#00FFFF' },
      { value: 0, color: '#FFFFFF' },
    ],
  },
  wind: {
    unit: 'm/s',
    gradient:
      'linear-gradient(to bottom, #8B0000, #FF0000, #FFA500, #FFFF00, #90EE90, #00FFFF)',
    stops: [
      { value: 30, color: '#8B0000' },
      { value: 25, color: '#FF0000' },
      { value: 20, color: '#FFA500' },
      { value: 15, color: '#FFFF00' },
      { value: 10, color: '#90EE90' },
      { value: 5, color: '#00FFFF' },
      { value: 0, color: '#FFFFFF' },
    ],
  },
  humidity: {
    unit: '%',
    gradient:
      'linear-gradient(to bottom, #0000FF, #4169E1, #00FFFF, #90EE90, #FFFF00)',
    stops: [
      { value: 100, color: '#0000FF' },
      { value: 80, color: '#4169E1' },
      { value: 60, color: '#00FFFF' },
      { value: 40, color: '#90EE90' },
      { value: 20, color: '#FFFF00' },
      { value: 0, color: '#FFFFFF' },
    ],
  },
};

function getLayerType(layerId: string): string {
  if (layerId.includes('temperature')) return 'temperature';
  if (layerId.includes('precipitation')) return 'precipitation';
  if (layerId.includes('wind')) return 'wind';
  if (layerId.includes('humidity')) return 'humidity';
  return 'temperature'; // default
}

function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function ColorLegend({ selectedLayerId }: ColorLegendProps) {
  const layerType = getLayerType(selectedLayerId);
  const config = legendConfigs[layerType];

  if (!config) return null;

  return (
    <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 w-16 rounded-sm">
      <div className="flex flex-col items-center">
        <div className="text-xs font-bold mb-3 text-center text-gray-700">
          {config.unit}
        </div>

        {/* Gradient Bar with Values Inside */}
        <div
          className="w-10 h-80 rounded-xl relative overflow-hidden"
          style={{
            background: config.gradient,
            border: '2px solid rgba(0,0,0,0.3)',
          }}
        >
          {/* Value Labels Inside the Bar */}
          {config.stops.map((stop, idx) => {
            const percentage =
              (1 -
                (stop.value - config.stops[config.stops.length - 1].value) /
                  (config.stops[0].value -
                    config.stops[config.stops.length - 1].value)) *
              100;
            const textColor = getContrastColor(stop.color);

            return (
              <div
                key={idx}
                className="absolute inset-x-0 flex items-center justify-center text-xs font-bold"
                style={{
                  top: `${percentage}%`,
                  transform: 'translateY(-50%)',
                  color: textColor,
                  textShadow:
                    textColor === '#FFFFFF'
                      ? '1px 1px 2px rgba(0,0,0,0.8)'
                      : '1px 1px 2px rgba(255,255,255,0.8)',
                }}
              >
                {stop.value}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
