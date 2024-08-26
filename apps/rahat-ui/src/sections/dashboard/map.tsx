import React, { memo } from 'react';
import Map, { MapRef, Marker, NavigationControl, Popup } from 'react-map-gl';
import { mapboxBasicConfig } from 'apps/rahat-ui/src/constants/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StyledMapWrapper } from '@rahat-ui/shadcn/src/components/maps';
import styled from '@emotion/styled';

const DEFAULT_LAT = 28.3949;
const DEFAULT_LNG = 84.124;

const Mark = styled.button`
  height: 10px;
  width: 10px;
  background-color: #f97316;
  border-radius: 9999px;
  cursor: pointer;
`;

function DashboardMap({ coordinates }: any) {
  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState(null) as any;

  const zoomToSelectedLoc = (e: React.SyntheticEvent, data: any) => {
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    setSelectedMarker(data);
    mapRef?.current?.flyTo({
      center: [data.longitude, data.latitude],
      zoom: 10,
    });
  };
  return (
    <StyledMapWrapper className="relative overflow-hidden rounded-md h-[400px]">
      {/* Map Indicators  */}
      <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-lg z-10 text-xs">
        <div className="flex space-x-2 items-center">
          <Mark />
          <p>Beneficiary</p>
        </div>
      </div>

      <Map
        style={{ width: '100%', height: '100%' }}
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
          <div>
            <Popup
              offset={25}
              latitude={selectedMarker.latitude}
              longitude={selectedMarker.longitude}
              onClose={() => setSelectedMarker(null)}
              closeButton={false}
            >
              <p className="text-sm tracking-wide">{selectedMarker.name}</p>
            </Popup>
          </div> // Marker Details
        ) : null}

        {coordinates &&
          coordinates?.map((item: any, index: number) => (
            <Marker
              key={index}
              longitude={Number(item.longitude)}
              latitude={Number(item.latitude)}
            >
              <Mark onClick={(e) => zoomToSelectedLoc(e, item)} />
            </Marker>
          ))}
      </Map>
    </StyledMapWrapper>
  );
}

export default memo(DashboardMap);
