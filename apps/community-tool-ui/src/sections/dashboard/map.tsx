import * as React from 'react';
import Map, { GeolocateControl, MapRef, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { communityMapboxBasicConfig } from '../../utils/mapconfigs';

export default function CommunityMap({
  coordinates,
}: {
  coordinates: number[];
}) {
  const mapRef = React.useRef<MapRef>(null);

  return (
    <div className="bg-card shadow rounded mt-2 col-span-4">
      <Map
        style={{ width: '100%', height: '330px' }}
        ref={mapRef}
        initialViewState={{
          longitude: 85.324,
          latitude: 27.7172,
          zoom: 6,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={communityMapboxBasicConfig.mapboxAccessToken}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
}
