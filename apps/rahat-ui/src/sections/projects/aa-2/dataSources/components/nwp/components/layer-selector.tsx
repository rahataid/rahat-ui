'use client';

import { useState } from 'react';
import type { GroupedLayers, WeatherLayer } from '../utils/weather-layers';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Layers as LayersIcon,
} from 'lucide-react';

interface LayerSelectorProps {
  groupedLayers: GroupedLayers;
  selectedLayerId: string;
  onLayerChange: (layerId: string) => void;
  showLayer: boolean;
  onShowLayerChange: (show: boolean) => void;
  isLoading: boolean;
}

const iconMap = {
  thermometer: Thermometer,
  'cloud-rain': CloudRain,
  wind: Wind,
  droplets: Droplets,
  gauge: Gauge,
  layers: LayersIcon,
};

export function LayerSelector({
  groupedLayers,
  selectedLayerId,
  onLayerChange,
  showLayer,
  onShowLayerChange,
  isLoading,
}: LayerSelectorProps) {
  const categories = Object.keys(groupedLayers);
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0] || 'DHM-WRF',
  );

  const getLayerImageSrc = (iconKey: string) => {
    switch (iconKey) {
      case 'thermometer':
        return '/heatwave/temperature.png';
      case 'cloud-rain':
        return '/heatwave/precipitation.png';
      case 'wind':
        return '/heatwave/wind.png';
      default:
        return '/heatwave/temperature.png';
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 z-50">
      {/* Tabs Section - Separate Card */}
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-sm shadow-lg px-2 py-1">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="bg-transparent h-auto p-0 gap-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-sm px-2 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm font-medium text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      {/* Layer Buttons - Floating on the right */}
      <div className="flex flex-row gap-2 items-end">
        {isLoading ? (
          <Card className="bg-background/55 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-lg shadow-lg p-0">
            <div className="animate-spin rounded-sm h-4 w-4 border-b-2 border-primary mx-auto" />
          </Card>
        ) : categories.length === 0 ? (
          <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-lg shadow-lg p-4">
            <p className="text-xs text-muted-foreground">No layers available</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2 items-end">
            {groupedLayers[selectedCategory]?.map((layer: WeatherLayer) => {
              const Icon =
                iconMap[layer.icon as keyof typeof iconMap] || LayersIcon;
              const isSelected = selectedLayerId === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => onLayerChange(layer.id)}
                  className={`flex items-center justify-between gap-1 px-2  rounded-full shadow-md font-medium text-sm transition-colors duration-150 w-fit
                    ${
                      isSelected
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-500/80 text-white hover:bg-gray-600'
                    }
                  `}
                  style={{
                    border: isSelected ? '2px solid #3b82f6' : 'none',
                    minWidth: '0',
                  }}
                >
                  <span className="flex items-center gap-2">
                    {/* <Icon className="h-5 w-5" /> */}
                    {layer.name}
                  </span>
                  <span className="-mr-2 w-[36px] h-[36px] rounded-full overflow-hidden border-2 border-white shadow-md inline-flex flex-shrink-0">
                    <img
                      src={getLayerImageSrc(layer.icon)}
                      alt={layer.name}
                      className="w-full h-full object-cover"
                    />
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
