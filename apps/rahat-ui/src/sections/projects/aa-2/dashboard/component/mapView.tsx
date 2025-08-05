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
import {
  usePagination,
  useProjectDashboardBeneficiaryMapLocation,
} from '@rahat-ui/query';
import { Heading } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { UUID } from 'crypto';
import {
  MUNICIPALITY,
  WARDS,
} from 'apps/rahat-ui/src/sections/dashboard/constant';

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

interface StatData {
  count: number;
  latitude: number[];
  longitude: number[];
}

interface LocationStat {
  name: string;
  data: StatData;
  group: string;
  createdAt: string;
  updatedAt: string;
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

export default function MapView({ projectId }: { projectId: UUID }) {
  const { filters, setFilters } = usePagination();
  const { data: mapLocation, isLoading: mapLoading } =
    useProjectDashboardBeneficiaryMapLocation(projectId, filters);

  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState<IBENEF | null>(
    null,
  );

  const mappedCoordinate: IBENEF[] =
    mapLocation &&
    mapLocation.flatMap((item) => {
      const [_, locationName] = item.name.split('_');
      return item.data.latitude.map((lat, index) => ({
        // name: `${locationName} - ${index + 1}`,
        name: item.name,
        latitude: item.data.latitude[index],
        longitude: item.data.longitude[index],
        type: MARKER_TYPE.BENEFICIARY,
      }));
    });

  console.log(mappedCoordinate);
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

  const handleFilterChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    const filterValue = value === 'ALL' ? '' : value;
    setFilters({
      ...filters,
      [name]: filterValue,
    });
  };

  // const result =
  //   mapLocation &&
  //   mapLocation.map((item) => {
  //     const [wardRaw, location] = item.name.split('_');
  //     const ward = wardRaw.replace('WARD', '');
  //     return { ward, location };
  //   });

  // const WARDS = [...new Set(result?.map((wl) => wl.ward))];
  // const MUNICIPALITY = [...new Set(result?.map((wl) => wl.location))];

  return (
    <div>
      <div className="flex justify-between">
        <Heading
          title="Map View"
          description="Track beneficiary locations"
          titleStyle={'text-xl'}
        />

        <div className="flex flex-row gap-3 lg:gap-4">
          <SelectComponent
            name="Ward"
            options={['ALL', ...WARDS]}
            onChange={(value) =>
              handleFilterChange({ target: { name: 'ward', value } })
            }
            value={filters?.ward || ''}
            className="w-full rounded-sm lg:w-48"
          />

          <SelectComponent
            name="Location"
            options={['ALL', ...MUNICIPALITY]}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'location', value },
              })
            }
            value={filters?.location || ''}
            className="w-full rounded-sm lg:w-48"
          />
        </div>
      </div>

      <div className="relative bg-card shadow-sm border rounded-sm p-1  h-[300px] z-0">
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
          {mappedCoordinate?.map((item, index) => (
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
                    className="bg-blue-600 rounded-full border border-white shadow-md"
                  />
                )}
              </button>
            </Marker>
          ))}
        </Map>
      </div>
    </div>
  );
}
