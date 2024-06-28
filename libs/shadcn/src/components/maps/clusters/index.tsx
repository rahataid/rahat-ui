import { memo, useEffect, useRef, useState } from 'react';
import Map, {
  GeoJSONSource,
  Layer,
  LngLatLike,
  MapLayerMouseEvent,
  MapRef,
  Source,
} from 'react-map-gl';
// components
//
import { MapBoxProps } from '../types';
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from './layers';

// ----------------------------------------------------------------------

function MapClusters({ dataForMap, ...other }: any) {
  const mapRef = useRef<MapRef>(null);

  const onClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];

    const clusterId = feature?.properties?.cluster_id;

    const mapboxSource = mapRef.current?.getSource(
      'earthquakes',
    ) as GeoJSONSource;

    mapboxSource.getClusterExpansionZoom(clusterId, (error, zoom) => {
      if (error) {
        return;
      }

      if (feature?.geometry.type === 'Point') {
        mapRef.current?.easeTo({
          center: feature?.geometry.coordinates as LngLatLike | undefined,
          zoom: Number.isNaN(zoom) ? 3 : zoom,
          duration: 500,
        });
      }
    });
  };

  return (
    <Map
      initialViewState={{
        latitude: 60,
        longitude: 80.59,
        zoom: 2,
      }}
      interactiveLayerIds={[clusterLayer.id || '']}
      onClick={onClick}
      ref={mapRef}
      {...other}
    >
      <Source
        id="earthquakes"
        type="geojson"
        data={dataForMap}
        cluster
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    </Map>
  );
}

export default memo(MapClusters);
