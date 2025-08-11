import {
  usePagination,
  useProjectDashboardBeneficiaryMapLocation,
  useProjectStore,
} from '@rahat-ui/query';
import * as turf from '@turf/turf';
import { Heading } from 'apps/rahat-ui/src/common';
import SearchDropdownComponent from 'apps/rahat-ui/src/common/searchDropdownComponent';
import { communityMapboxBasicConfig } from 'apps/rahat-ui/src/utils/map-config';
import { UUID } from 'crypto';
import { Dot } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
} from 'react-map-gl';

const DEFAULT_LAT = 28.7628028;
const DEFAULT_LNG = 80.3671506;

const KARNALI_RIVER_LAT = 28.7628028;
const KARNALI_RIVER_LNG = 80.3671506;

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

export default function MapView({
  projectId,
  benefStats,
}: {
  projectId: UUID;
  benefStats: any;
}) {
  const { filters, setFilters } = usePagination();
  const { data: mapLocation, isLoading: mapLoading } =
    useProjectDashboardBeneficiaryMapLocation(projectId, filters);

  const project = useProjectStore((p) => p.singleProject);
  const uniueWard =
    benefStats?.find((stat) => stat.name === 'UNIQUE_WARDS')?.data || [];

  const transformedWardNumber =
    (uniueWard &&
      uniueWard.map((item) => ({
        label: item.ward.toString(),
        value: item.ward.toString(),
      }))) ||
    [];

  transformedWardNumber.unshift({ label: 'All', value: '' });

  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState<IBENEF | null>(
    null,
  );

  const mappedCoordinate: IBENEF[] =
    mapLocation?.flatMap((item) =>
      item?.data?.locations?.map((loc, index) => ({
        name: item?.name,
        latitude: loc?.lat,
        longitude: loc?.long,
        type: MARKER_TYPE?.BENEFICIARY,
      })),
    ) || [];

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

  const handleSelect = (key: string, value: string) => {
    if (key === 'Ward') {
      setFilters({ ...filters, ward_no: value });
    }
  };
  return (
    <div>
      <div className="flex justify-between">
        <Heading
          title={`Map View`}
          description="Track beneficiary locations"
          titleStyle={'text-xl'}
        />

        <div className="flex flex-row gap-3 lg:gap-4">
          <SearchDropdownComponent
            transformedData={transformedWardNumber}
            title={'Ward'}
            handleSelect={handleSelect}
          />
        </div>
      </div>

      <div className="relative bg-card shadow-sm border rounded-sm p-1 w-full  h-[400px] z-0">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: DEFAULT_LNG,
            latitude: DEFAULT_LAT,
            zoom: 9,
          }}
          style={{ width: '100%', height: '100%', borderRadius: '10px' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={communityMapboxBasicConfig.mapboxAccessToken}
        >
          <NavigationControl position="bottom-right" />
          <GeolocateControl position="bottom-right" />

          <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-lg z-10 text-xs flex justify-center items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>Beneficiary</div>
          </div>
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
