import React, { memo } from 'react';
import Map, { MapRef, Marker, NavigationControl, Popup } from 'react-map-gl';
import { mapboxBasicConfig } from 'apps/rahat-ui/src/constants/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StyledMapWrapper } from '@rahat-ui/shadcn/src/components/maps';
import { Heading } from 'apps/rahat-ui/src/common';
import { roundValue } from './utils/color.utils';

const DEFAULT_LAT = 28.3949;
const DEFAULT_LNG = 84.124;

interface Coordinate {
  latitude: number;
  longitude: number;
  name: string;
  stationIndex: number;
  value?: number;
  unit?: string;
  statusColor?: string;
  bgColor?: string;
}

interface TemperatureWatchMapProps {
  coordinates: Coordinate[];
}

function TemperatureWatchMap({ coordinates }: TemperatureWatchMapProps) {
  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState<Coordinate | null>(
    null,
  );

  const zoomToSelectedLoc = (e: React.SyntheticEvent, data: Coordinate) => {
    e.stopPropagation();
    setSelectedMarker(data);
    mapRef?.current?.flyTo({
      center: [data.longitude, data.latitude],
      zoom: 10,
    });
  };

  return (
    <div className="p-4 rounded-sm shadow border">
      <Heading
        title="Map"
        titleStyle="text-lg/7 font-semibold"
        description="Temperature Station Location"
      />
      {/* @ts-expect-error - StyledMapWrapper type definition issue */}
      <StyledMapWrapper className="relative overflow-hidden rounded-md h-[400px]">
        {/* Map Indicators */}
        <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-lg z-10 text-xs">
          <div className="flex space-x-2 items-center">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
            <p>Temperature Station</p>
          </div>
        </div>

        <Map
          style={{ width: '100%', height: '100%', borderRadius: '8px' }}
          ref={mapRef}
          initialViewState={{
            longitude: DEFAULT_LNG,
            latitude: DEFAULT_LAT,
            zoom: 5.5,
            bearing: 0,
            pitch: 0,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={mapboxBasicConfig.mapboxAccessToken}
        >
          <NavigationControl position="top-left" />

          {selectedMarker ? (
            <Popup
              offset={25}
              latitude={selectedMarker.latitude}
              longitude={selectedMarker.longitude}
              onClose={() => setSelectedMarker(null)}
              closeButton={false}
            >
              <p className="text-sm font-semibold tracking-wide">
                {selectedMarker.name}
              </p>
              <p className="text-sm">
                Station Index: {selectedMarker.stationIndex}
              </p>
              {selectedMarker.value !== undefined && (
                <p className="text-sm font-semibold mt-1">
                  Temperature: {roundValue(selectedMarker.value)}
                  {selectedMarker.unit || '°C'}
                </p>
              )}
            </Popup>
          ) : null}

          {coordinates &&
            coordinates?.map((item: Coordinate, index: number) => {
              // Extract background color from statusColor (e.g., "bg-red-100 text-red-800 border border-red-600")
              const statusColorClass = item.statusColor || 'bg-gray-100';
              const bgMatch = statusColorClass.match(/bg-[\w-]+/);
              const bgColorClass = bgMatch ? bgMatch[0] : 'bg-orange-100';

              // Convert Tailwind class to actual color - matching status badge colors
              const colorMap: Record<string, string> = {
                // Temperature status colors (extracted from getTemperatureColor)
                'bg-red-100': '#fee2e2',
                'bg-orange-100': '#ffedd5',
                'bg-orange-50': '#fff7ed',
                'bg-amber-50': '#fffbeb',
                'bg-yellow-50': '#fefce8',
                'bg-lime-50': '#f7fee7',
                'bg-green-50': '#f0fdf4',
                'bg-green-100': '#dcfce7',
                'bg-cyan-50': '#ecfeff',
                'bg-sky-50': '#f0f9ff',
                'bg-blue-50': '#eff6ff',
                'bg-blue-100': '#dbeafe',
                'bg-indigo-50': '#eef2ff',
                'bg-violet-50': '#f5f3ff',
                'bg-purple-50': '#faf5ff',
                'bg-gray-50': '#f9fafb',
                'bg-gray-100': '#f3f4f6',
              };
              const backgroundColor = colorMap[bgColorClass] || '#ffedd5';

              return (
                <Marker
                  key={index}
                  longitude={Number(item.longitude)}
                  latitude={Number(item.latitude)}
                  anchor="center"
                >
                  <div
                    onClick={(e) => zoomToSelectedLoc(e, item)}
                    className="cursor-pointer hover:scale-125 transition-all"
                    style={{
                      backgroundColor,
                      borderRadius: '50%',
                      width: '56px',
                      height: '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      fontWeight: '700',
                      fontSize: '12px',
                      color: '#1f2937',
                    }}
                  >
                    {item.value !== undefined
                      ? `${roundValue(item.value)}${item.unit || '°C'}`
                      : '--'}
                  </div>
                </Marker>
              );
            })}
        </Map>
      </StyledMapWrapper>
    </div>
  );
}

export default memo(TemperatureWatchMap);
