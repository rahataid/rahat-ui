import * as React from 'react';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { communityMapboxBasicConfig } from '../../utils/mapconfigs';
import { MapPin, Landmark, Home } from 'lucide-react';
import MarkerDetails from './MarkerDetails';
import * as turf from '@turf/turf';
import MapIndicators from './MapIndicators';

const DEFAULT_LAT = 27.712021;
const DEFAULT_LNG = 85.31295;

const KARNALI_RIVER_LAT = 29.20272;
const KARNALI_RIVER_LNG = 81.6145214;

interface IBENEF {
  name: string;
  latitude: number;
  longitude: number;
}

export default function CommunityMap({ coordinates }: any) {
  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState(null) as any;

  const zoomToSelectedLoc = (e: React.SyntheticEvent, benef: IBENEF) => {
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    setSelectedMarker(benef);
    mapRef?.current?.flyTo({
      center: [benef.longitude, benef.latitude],
      zoom: 10,
    });
  };

  function renderMarkerColor(d: IBENEF) {
    const source = turf.point([d.longitude, d.latitude]);
    const destination = turf.point([KARNALI_RIVER_LNG, KARNALI_RIVER_LAT]);
    const distance = turf.distance(source, destination, {
      units: 'kilometers',
    });
    const fixedDistance = Number((distance * 100).toFixed(2));
    if (fixedDistance <= 50) return '#B80505 '; // Red
    if (fixedDistance > 50 && fixedDistance <= 200) return '#f1c40f'; // Yellow
    return '#0C9B46'; // Green
  }

  return (
    <div className="relative bg-card shadow rounded mt-2 col-span-4">
      <MapIndicators />
      <Map
        style={{ width: '100%', height: '330px' }}
        ref={mapRef}
        initialViewState={{
          longitude: DEFAULT_LNG,
          latitude: DEFAULT_LAT,
          zoom: 5.5,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={communityMapboxBasicConfig.mapboxAccessToken}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />

        {selectedMarker ? (
          <MarkerDetails
            selectedMarker={selectedMarker}
            closeSelectedMarker={() => setSelectedMarker(null)}
          />
        ) : null}

        {coordinates.map((item: any, index: number) => {
          return (
            <Marker
              key={index}
              longitude={Number(item.longitude)}
              latitude={Number(item.latitude)}
            >
              <button
                type="button"
                className="cursor-pointer"
                onClick={(e) => zoomToSelectedLoc(e, item)}
              >
                {item.type === 'Bank' && <Landmark color="#0C609B" size={16} />}
                {item.type === 'Evacuation' && <Home color="green" size={16} />}
                <MapPin
                  fill={renderMarkerColor(item)}
                  size={20}
                  color={renderMarkerColor(item)}
                />
              </button>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
