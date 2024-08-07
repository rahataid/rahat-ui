import React, { memo } from 'react';
import Map, { MapRef, Marker, NavigationControl, Popup } from 'react-map-gl';
import { Waves } from 'lucide-react';
import { mapboxBasicConfig } from 'apps/rahat-ui/src/constants/config';
import 'mapbox-gl/dist/mapbox-gl.css';

const DEFAULT_LAT = 28.3949;
const DEFAULT_LNG = 84.124;

type IProps = {
  basin: string;
  lat: number;
  lng: number;
  status: string;
};

function DHMMap({ basin, lat, lng, status }: IProps) {
  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState(null) as any;

  const zoomToSelectedLoc = (e: React.SyntheticEvent, data: any) => {
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    setSelectedMarker(data);
    mapRef?.current?.flyTo({
      center: [data.lng, data.lat],
      zoom: 10,
    });
  };
  return (
    <>
      {/* Map Indicators  */}
      <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-lg z-10 text-xs">
        <div className="flex space-x-2">
          <div>
            <Waves className="text-blue-500" size={13} />
          </div>
          <div> River Basin </div>
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
              latitude={selectedMarker.lat}
              longitude={selectedMarker.lng}
              onClose={() => setSelectedMarker(null)}
              closeButton={false}
            >
              <p className="text-sm tracking-wide">{selectedMarker.basin}</p>
              <p>{selectedMarker.status}</p>
            </Popup>
          </div> // Marker Details
        ) : null}

        {lat && lng && (
          <Marker longitude={lng} latitude={lat}>
            <button
              type="button"
              className="cursor-pointer"
              onClick={(e) =>
                zoomToSelectedLoc(e, {
                  lat: lat,
                  lng: lng,
                  status: status,
                  basin: basin,
                })
              }
            >
              <Waves className="text-blue-500" size={16} />
            </button>
          </Marker>
        )}
      </Map>
    </>
  );
}

export default memo(DHMMap);
