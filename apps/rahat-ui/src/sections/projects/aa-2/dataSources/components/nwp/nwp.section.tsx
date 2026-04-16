'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  fetchWeatherLayers,
  type GroupedLayers,
  type WeatherLayer,
} from './utils/weather-layers';
import { LayerSelector } from './components/layer-selector';
import { TimeControl } from './components/time-control';
import { ColorLegend } from './components/color-legend';
import { RegionSelector } from './components/region-selector';
import type { RegionType } from './utils/districts';
import {
  CloudRain,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { tileCache } from './utils/tile-cache';

// Dynamically import WeatherMap to avoid SSR issues with Leaflet
const WeatherMap = dynamic(
  () => import('./components/weather-map').then((mod) => mod.WeatherMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  },
);

export function NWPSection() {
  const [groupedLayers, setGroupedLayers] = useState<GroupedLayers>({});
  const [availableTimes, setAvailableTimes] = useState<Date[]>([]);
  const [isLoadingLayers, setIsLoadingLayers] = useState(true);
  const [selectedLayerId, setSelectedLayerId] = useState('');
  const [currentTime, setCurrentTime] = useState(
    new Date('2026-02-02T05:00:00.000Z'),
  );
  const [opacity, setOpacity] = useState(0.7);
  const [showLayer, setShowLayer] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isWeatherLayerVisible, setIsWeatherLayerVisible] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('district');

  // Fetch layers on mount
  useEffect(() => {
    async function loadLayers() {
      setIsLoadingLayers(true);

      const { groupedLayers: fetchedLayers, availableTimes: times } =
        await fetchWeatherLayers();

      setGroupedLayers(fetchedLayers);
      setAvailableTimes(times);

      // Set first layer as selected from first category
      const firstCategory = Object.keys(fetchedLayers)[0];
      if (firstCategory && fetchedLayers[firstCategory].length > 0) {
        setSelectedLayerId(fetchedLayers[firstCategory][0].id);
      }

      // Set first available time if exists
      if (times.length > 0) {
        setCurrentTime(times[0]);
      }

      setIsLoadingLayers(false);
    }

    loadLayers();
  }, []);

  const selectedLayer = useMemo(() => {
    for (const category of Object.keys(groupedLayers)) {
      const layer = groupedLayers[category].find(
        (l: WeatherLayer) => l.id === selectedLayerId,
      );
      if (layer) return layer;
    }
    return undefined;
  }, [groupedLayers, selectedLayerId]);

  const handleRegionChange = (region: RegionType) => {
    setSelectedRegion(region);
  };

  const timeString = useMemo(() => {
    return currentTime.toISOString();
  }, [currentTime]);

  // Preload upcoming tiles for smooth playback
  useEffect(() => {
    if (selectedLayer && availableTimes.length > 0) {
      const currentIndex = availableTimes.findIndex(
        (time) => time.getTime() === currentTime.getTime(),
      );

      if (currentIndex !== -1) {
        // Preload next 5 time steps for smooth animation
        tileCache.preloadTiles(
          selectedLayer.layer,
          availableTimes,
          currentIndex,
          5,
        );
      }
    }
  }, [selectedLayer, currentTime, availableTimes]);

  // Clear cache when layer changes to free memory
  useEffect(() => {
    tileCache.clearCache();
  }, [selectedLayerId]);

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map Container */}
        <div className="absolute inset-0">
          <WeatherMap
            selectedLayer={selectedLayer?.layer || ''}
            timeValue={timeString}
            opacity={opacity}
            showLayer={showLayer && isWeatherLayerVisible}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
          />
        </div>

        {/* Control Panels */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Toggle Controls Button - Always visible */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="absolute left-4 bottom-24 z-30 bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow pointer-events-auto"
            title={showControls ? 'Hide controls' : 'Show controls'}
          >
            {showControls ? (
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Right Section - Weather Layers */}
          {showControls && (
            <div className="absolute right-2 pointer-events-auto flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-auto">
              {/* Weather Layer Selector */}
              <div className="h-fit">
                <LayerSelector
                  groupedLayers={groupedLayers}
                  selectedLayerId={selectedLayerId}
                  onLayerChange={setSelectedLayerId}
                  showLayer={showLayer}
                  onShowLayerChange={setShowLayer}
                  isLoading={isLoadingLayers}
                />
              </div>
            </div>
          )}

          {/* Left Section - Region Selector and Color Legend */}
          {showControls && (
            <div className="absolute left-4 top-4 pointer-events-auto flex flex-col gap-4">
              {/* Region Selector */}
              <RegionSelector
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
              />

              {/* Color Legend - Below Region Selector */}
              {selectedLayerId && showLayer && (
                <div className="pointer-events-auto z-10">
                  <ColorLegend selectedLayerId={selectedLayerId} />
                </div>
              )}
            </div>
          )}

          {/* Bottom Section - Time Control (Video Player Style) */}
          {showControls && (
            <>
              <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
                <TimeControl
                  currentTime={currentTime}
                  onTimeChange={setCurrentTime}
                  opacity={opacity}
                  onOpacityChange={setOpacity}
                  availableTimes={availableTimes}
                />
              </div>
              {/* Weather Layer Toggle Button - moved to bottom right */}
              {/* {selectedLayer && showLayer && (
                <button
                  onClick={() =>
                    setIsWeatherLayerVisible(!isWeatherLayerVisible)
                  }
                  className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow flex items-center justify-center gap-2 text-sm font-medium z-40"
                  title={
                    isWeatherLayerVisible
                      ? 'Hide weather layer'
                      : 'Show weather layer'
                  }
                >
                  {isWeatherLayerVisible ? (
                    <>
                      <Eye className="w-5 h-5 text-gray-700" />
                      <span>Hide Weather Layer</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-5 h-5 text-gray-700" />
                      <span>Show Weather Layer</span>
                    </>
                  )}
                </button>
              )} */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
