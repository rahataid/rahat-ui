import * as React from 'react';
import Map, { GeolocateControl, MapRef, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { communityMapboxBasicConfig } from '../../utils/mapconfigs';
import { FlagIcon } from 'lucide-react';

const DEFAULT_LAT = 27.712021;
const DEFAULT_LNG = 85.31295;

interface IPROPS {
  coordinates: [{
    name: string, 
    latitude: number,
    longitude: number
  }]
}


export default function CommunityMap({
  coordinates
}: IPROPS) {
  console.log("coods=>", coordinates)
  const mapRef = React.useRef<MapRef>(null);

  return (
    <div className="bg-card shadow rounded h-[calc(100vh-500px)] mt-2 col-span-4">
      <Map
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
        initialViewState={{
          longitude: DEFAULT_LNG,
          latitude: DEFAULT_LAT,
          zoom: 6,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={communityMapboxBasicConfig.mapboxAccessToken}
      >
        <GeolocateControl position="top-left" />
        <NavigationControl position="top-left" />

        {coordinates.map((benef: any, index:number) => {
					return (
						<Marker key={index} longitude={Number(benef.longitude)} latitude={Number(benef.latitude)}>
							<button
								type="button"
								className="cursor-pointer"
							>
								{<FlagIcon size={30}  />}
							</button>
						</Marker>
					);
				})}
      </Map>
    </div>
  );
}
