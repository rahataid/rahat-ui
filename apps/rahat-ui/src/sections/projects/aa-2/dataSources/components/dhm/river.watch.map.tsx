import React, { memo } from 'react';
import Map, { MapRef, Marker, NavigationControl, Popup } from 'react-map-gl';
import { mapboxBasicConfig } from 'apps/rahat-ui/src/constants/config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StyledMapWrapper } from '@rahat-ui/shadcn/src/components/maps';
import styled from '@emotion/styled';
import { Link2, MapPin } from 'lucide-react';
import { Heading } from 'apps/rahat-ui/src/common';

const DEFAULT_LAT = 28.3949;
const DEFAULT_LNG = 84.124;

const Mark = styled.button`
  height: 10px;
  width: 10px;
  background-color: #f97316;
  border-radius: 9999px;
  cursor: pointer;
`;

function RiverWatchMap({ coordinates }: any) {
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
    <div className="p-4 rounded-sm shadow border">
      <Heading
        title="Map"
        titleStyle="text-lg/7 font-semibold"
        description="River Watch Map"
      />
      <StyledMapWrapper className="relative overflow-hidden rounded-md h-[400px]">
        {/* Map Indicators  */}
        <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-lg z-10 text-xs">
          <div className="flex space-x-2 items-center">
            <MapPin color="red" size={18} fill="red" fillOpacity={0.3} />
            <p>River</p>
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
            <div>
              <Popup
                offset={25}
                latitude={selectedMarker.latitude}
                longitude={selectedMarker.longitude}
                onClose={() => setSelectedMarker(null)}
                closeButton={false}
              >
                <p className="text-sm tracking-wide">{selectedMarker.name}</p>
                <p className="text-sm">
                  Station Index = {selectedMarker.stationIndex}
                </p>
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
                <MapPin
                  size={18}
                  color="red"
                  fill="red"
                  fillOpacity={0.3}
                  onClick={(e) => zoomToSelectedLoc(e, item)}
                />
              </Marker>
            ))}
        </Map>
      </StyledMapWrapper>
      <div className="mt-4">
        <p className="font-medium text-sm/6">Data Sources:</p>
        <div className="flex space-x-2 items-center">
          <Link2 color="gray" size={16} strokeWidth={2.5} />
          <span className="text-primary text-sm/4">www.dhm.com</span>
        </div>
        <div className="flex space-x-2 items-center">
          <Link2 color="gray" size={16} strokeWidth={2.5} />
          <span className="text-primary text-sm/4">www.hydrology.com</span>
        </div>
      </div>
    </div>
  );
}

export default memo(RiverWatchMap);
