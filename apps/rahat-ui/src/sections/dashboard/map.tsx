import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import Map, { MapRef, Marker } from 'react-map-gl';
import MarkerDetails from './markerDetails';

const DEFAULT_LAT = 0.7893;
const DEFAULT_LNG = 113.9213;

interface IBENEF {
  name: string;
  latitude: number;
  longitude: number;
  geometry: {
    coordinates: [longitude: number, latitude: number];
  };
}

export default function ElMap({ dataForMap }: any) {
  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState(null) as any;

  const zoomToSelectedLoc = (e: React.SyntheticEvent, benef: IBENEF) => {
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    setSelectedMarker(benef);
    mapRef?.current?.flyTo({
      center: [benef.geometry.coordinates[0], benef.geometry.coordinates[1]],
      zoom: 10,
    });
  };

  return (
    <div className="relative bg-card shadow rounded mt-2 col-span-4">
      <Map
        style={{ width: '100%', height: '600px' }}
        ref={mapRef}
        initialViewState={{
          longitude: DEFAULT_LNG,
          latitude: DEFAULT_LAT,
          zoom: 4.2,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {selectedMarker ? (
          <MarkerDetails
            selectedMarker={selectedMarker}
            closeSelectedMarker={() => setSelectedMarker(null)}
          />
        ) : null}

        {dataForMap?.features?.map((item: any, index: number) => {
          return (
            <Marker
              key={item.type}
              longitude={Number(item.geometry.coordinates[0])}
              latitude={Number(item.geometry.coordinates[1])}
            >
              <button
                type="button"
                className="cursor-pointer"
                onClick={(e) => zoomToSelectedLoc(e, item)}
              >
                <MapPin color="#0C609B" size={20} />
              </button>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
