import * as React from 'react';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dot } from 'lucide-react';
import * as turf from '@turf/turf';
import { communityMapboxBasicConfig } from 'apps/rahat-ui/src/utils/map-config';

const DEFAULT_LAT = 27.712021;
const DEFAULT_LNG = 85.31295;

const KARNALI_RIVER_LAT = 29.20272;
const KARNALI_RIVER_LNG = 81.6145214;

const MARKER_TYPE = {
  BENEFICIARY: 'BENEFICIARY',
};

interface IBENEF {
  name: string;
  latitude: number;
  longitude: number;
  type: string;
}

function MarkerDetails({
  selectedMarker,
  closeSelectedMarker,
}: {
  selectedMarker: IBENEF;
  closeSelectedMarker: () => void;
}) {
  return (
    <div>
      <Popup
        offset={25}
        latitude={selectedMarker.latitude}
        longitude={selectedMarker.longitude}
        onClose={closeSelectedMarker}
        closeButton={false}
      >
        <h3>{selectedMarker.name}</h3>
      </Popup>
    </div>
  );
}

export default function MapView() {
  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState<IBENEF | null>(
    null,
  );

  const dummyCoordinates: IBENEF[] = [
    {
      name: 'A',
      latitude: 27.73,
      longitude: 85.31,
      type: MARKER_TYPE.BENEFICIARY,
    },
    {
      name: 'B',
      latitude: 27.72,
      longitude: 85.32,
      type: MARKER_TYPE.BENEFICIARY,
    },
    {
      name: 'C',
      latitude: 27.74,
      longitude: 85.3,
      type: MARKER_TYPE.BENEFICIARY,
    },
  ];

  const zoomToSelectedLoc = (e: React.SyntheticEvent, benef: IBENEF) => {
    e.stopPropagation();
    setSelectedMarker(benef);
    mapRef?.current?.flyTo({
      center: [benef.longitude, benef.latitude],
      zoom: 10,
    });
  };

  const renderMarkerColor = (d: IBENEF) => {
    const source = turf.point([d.longitude, d.latitude]);
    const destination = turf.point([KARNALI_RIVER_LNG, KARNALI_RIVER_LAT]);
    const distance = turf.distance(source, destination, {
      units: 'kilometers',
    });
    const fixedDistance = Number((distance * 100).toFixed(2));
    if (fixedDistance <= 50) return '#B80505';
    if (fixedDistance > 50 && fixedDistance <= 200) return '#f1c40f';
    return '#0C9B46';
  };

  return (
    <div className="relative bg-card shadow-sm border rounded-sm p-1  h-full z-0">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: DEFAULT_LNG,
          latitude: DEFAULT_LAT,
          zoom: 10,
        }}
        style={{ width: '100%', height: '100%', borderRadius: '10px' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={communityMapboxBasicConfig.mapboxAccessToken}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />
        {selectedMarker ? (
          <MarkerDetails
            selectedMarker={selectedMarker}
            closeSelectedMarker={() => setSelectedMarker(null)}
          />
        ) : null}
        {dummyCoordinates.map((item, index) => (
          <Marker
            key={index}
            longitude={item.longitude}
            latitude={item.latitude}
          >
            <button
              type="button"
              className="cursor-pointer"
              onClick={(e) => zoomToSelectedLoc(e, item)}
            >
              {item.type === MARKER_TYPE.BENEFICIARY && (
                <Dot
                  fill={renderMarkerColor(item)}
                  size={10}
                  color={renderMarkerColor(item)}
                  className=' className=" bg-blue-600 rounded-full border border-white shadow-md"'
                />
              )}
            </button>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
