'use client';

import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Info } from 'lucide-react';
import type { WeatherLayer } from '../utils/weather-layers';

interface MapLegendProps {
  selectedLayerId: string;
  layers: WeatherLayer[];
}

export function MapLegend({ selectedLayerId, layers }: MapLegendProps) {
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

  if (!selectedLayer) return null;

  return (
    <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-1 text-balance">
            {selectedLayer.name}
          </h3>
          <p className="text-sm text-muted-foreground text-balance">
            {selectedLayer.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Data source: DHM Nepal GeoServer WMS
          </p>
        </div>
      </div>
    </Card>
  );
}
