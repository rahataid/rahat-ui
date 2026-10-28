import * as React from 'react';
import Map, {
  GeolocateControl,
  Layer,
  LayerProps,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
  Popup,
  Source,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { useTranslations } from 'next-intl';
import { communityMapboxBasicConfig } from 'apps/rahat-ui/src/utils/map-config';

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

// ponytail: one GeoJSON source + WebGL layers instead of a DOM <Marker> per beneficiary (100k DOM nodes hang the page); clustering keeps it light.
const CLUSTER_LAYER = 'clusters';
const POINT_LAYER = 'unclustered-point';

const clusterLayer: LayerProps = {
  id: CLUSTER_LAYER,
  type: 'circle',
  source: 'beneficiaries',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1c40f',
      1000,
      '#f28cb1',
    ],
    'circle-radius': ['step', ['get', 'point_count'], 14, 100, 18, 1000, 24],
  },
};

const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'beneficiaries',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': ['get', 'point_count_abbreviated'],
    'text-size': 11,
  },
};

const pointLayer: LayerProps = {
  id: POINT_LAYER,
  type: 'circle',
  source: 'beneficiaries',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': ['get', 'color'],
    'circle-radius': 5,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
};

const colorFor = (km: number) => {
  if (km <= 50) return '#B80505';
  if (km <= 200) return '#f1c40f';
  return '#0C9B46';
};

export default function MapView({
  mapLocation,
}: {
  mapLocation: IBENEF[] | null;
}) {
  const tg = useTranslations('GLOBAL');
  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState<IBENEF | null>(
    null,
  );

  const first = mapLocation?.[0];

  // computed once per data change, not per render
  const geojson = React.useMemo(() => {
    const origin = first ? turf.point([first.longitude, first.latitude]) : null;
    return {
      type: 'FeatureCollection' as const,
      features: (mapLocation ?? []).map((d) => {
        const km = origin
          ? Number(
              (
                turf.distance(turf.point([d.longitude, d.latitude]), origin, {
                  units: 'kilometers',
                }) * 100
              ).toFixed(2),
            )
          : 0;
        return {
          type: 'Feature' as const,
          properties: { name: d.name, color: colorFor(km) },
          geometry: {
            type: 'Point' as const,
            coordinates: [d.longitude, d.latitude],
          },
        };
      }),
    };
  }, [mapLocation, first]);

  const handleClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (!feature) return setSelectedMarker(null);
    const [longitude, latitude] = (feature.geometry as any).coordinates;
    if (feature.layer.id === CLUSTER_LAYER) {
      const source = mapRef.current?.getSource('beneficiaries') as any;
      source?.getClusterExpansionZoom(
        feature.properties?.cluster_id,
        (err: unknown, zoom: number) => {
          if (err) return;
          mapRef.current?.easeTo({ center: [longitude, latitude], zoom });
        },
      );
      return;
    }
    setSelectedMarker({
      name: feature.properties?.name,
      latitude,
      longitude,
      type: MARKER_TYPE.BENEFICIARY,
    });
    mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 10 });
  };

  return (
    <div className="relative bg-card shadow-sm border rounded-sm p-1  h-full z-0">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: first?.longitude,
          latitude: first?.latitude,
          zoom: 10,
        }}
        style={{ width: '100%', height: '100%', borderRadius: '10px' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={communityMapboxBasicConfig.mapboxAccessToken}
        interactiveLayerIds={[CLUSTER_LAYER, POINT_LAYER]}
        onClick={handleClick}
        // ponytail: small tile cache + no antialias/fade to keep GPU/memory use low
        maxTileCacheSize={20}
        antialias={false}
        fadeDuration={0}
        reuseMaps
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl position="bottom-right" />
        <div className="absolute top-2 right-2 bg-white p-2 rounded shadow-lg z-10 text-xs flex justify-center items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div>{tg('BENEFICIARY')}</div>
        </div>
        <Source
          id="beneficiaries"
          type="geojson"
          data={geojson}
          cluster
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...pointLayer} />
        </Source>
        {selectedMarker ? (
          <MarkerDetails
            selectedMarker={selectedMarker}
            closeSelectedMarker={() => setSelectedMarker(null)}
          />
        ) : null}
      </Map>
    </div>
  );
}
