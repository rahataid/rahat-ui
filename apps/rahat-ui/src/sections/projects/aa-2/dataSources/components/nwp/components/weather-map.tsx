'use client';

import React from 'react';
import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { RegionType } from '../utils/districts';
import { BufferedWMSLayer } from './buffered-wms-layer';
import { DistrictLayer } from './district-layer';

interface WeatherMapProps {
  selectedLayer: string;
  timeValue: string;
  opacity: number;
  showLayer: boolean;
  selectedRegion?: RegionType;
}

export function WeatherMap({
  selectedLayer,
  timeValue,
  opacity,
  showLayer,
  selectedRegion = 'district',
}: WeatherMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative h-full w-full" onMouseMove={handleMouseMove}>
      <MapContainer
        center={[28.3949, 84.124] as [number, number]}
        zoom={7}
        className="h-full w-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Base Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Buffered WMS Weather Overlay Layer */}
        {selectedLayer && showLayer && (
          <BufferedWMSLayer
            layer={selectedLayer}
            time={timeValue}
            opacity={opacity}
          />
        )}

        {/* Region Boundaries Layer */}
        <DistrictLayer
          regionType={selectedRegion}
          showRegions={true}
          onRegionHover={setHoveredRegion}
        />
      </MapContainer>

      {/* Region Name Tooltip - Follows Cursor */}
      {hoveredRegion && (
        <div
          className="fixed bg-black/80 text-white px-3 py-2 rounded text-sm font-medium pointer-events-none z-50"
          style={{
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y + 10}px`,
          }}
        >
          {hoveredRegion}
        </div>
      )}
    </div>
  );
}
