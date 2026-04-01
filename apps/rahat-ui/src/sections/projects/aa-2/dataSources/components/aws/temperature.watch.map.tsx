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
  title?: string;
  description?: string;
  indicatorTitle?: string;
  popupLabel?: string;
  unitLabel?: string;
}

function TemperatureWatchMap({
  coordinates,
  title = 'Map',
  description = 'Temperature Station Location',
  indicatorTitle = 'Temperature Station',
  popupLabel = 'Temperature',
  unitLabel = '°C',
}: TemperatureWatchMapProps) {
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
        title={title}
        titleStyle="text-lg/7 font-semibold"
        description={description}
      />
      {/* @ts-expect-error - StyledMapWrapper type definition issue */}
      <StyledMapWrapper className="relative overflow-hidden rounded-md h-[400px]">
        {/* Map Indicators */}
        <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-lg z-10 text-xs">
          <div className="flex space-x-2 items-center">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
            <p>{indicatorTitle}</p>
          </div>
        </div>

        <Map
          style={{ width: '100%', height: '100%', borderRadius: '8px' }}
          ref={mapRef}
          initialViewState={{
            longitude: DEFAULT_LNG,
            latitude: DEFAULT_LAT,
            zoom: 5.2,
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
                  {popupLabel}: {roundValue(selectedMarker.value)}
                  {selectedMarker.unit || unitLabel}
                </p>
              )}
            </Popup>
          ) : null}

          {coordinates &&
            coordinates?.map((item: Coordinate, index: number) => {
              const statusStyling =
                item.statusColor ||
                'bg-gray-100 text-gray-800 border border-gray-200';

              return (
                <Marker
                  key={index}
                  longitude={Number(item.longitude)}
                  latitude={Number(item.latitude)}
                  anchor="center"
                >
                  <div
                    onClick={(e) => zoomToSelectedLoc(e, item)}
                    className={`cursor-pointer hover:scale-125 transition-all rounded-full border-2 border-white w-10 h-10 flex items-center justify-center font-bold text-[10px] ${statusStyling}`}
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
