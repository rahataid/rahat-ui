'use client';

import { useState } from 'react';
import type { GroupedLayers, WeatherLayer } from '../utils/weather-layers';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
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

  return (
    <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayersIcon className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Weather Layers</h3>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="layer-toggle"
            checked={showLayer}
            onCheckedChange={onShowLayerChange}
          />
          <Label htmlFor="layer-toggle" className="text-xs cursor-pointer">
            {showLayer ? 'On' : 'Off'}
          </Label>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Loading layers...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-muted-foreground">No layers available</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {groupedLayers[selectedCategory]?.map((layer: WeatherLayer) => {
              const Icon =
                iconMap[layer.icon as keyof typeof iconMap] || LayersIcon;
              const isSelected = selectedLayerId === layer.id;

              return (
                <Button
                  key={layer.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => onLayerChange(layer.id)}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">{layer.name}</span>
                    <span className="text-xs opacity-80 font-normal">
                      {layer.description}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
