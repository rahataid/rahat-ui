import * as React from 'react';
import Map, { GeolocateControl, MapRef, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { communityMapboxBasicConfig } from '../../utils/mapconfigs';
import {  MapPin } from 'lucide-react';
import MarkerDetails from './MarkerDetails';

const DEFAULT_LAT = 27.712021;
const DEFAULT_LNG = 85.31295;

interface IPROPS {
  coordinates: [{
    name: string, 
    latitude: number,
    longitude: number
  }]
}

interface IBENEF {
  name: string,
  latitude: number,
  longitude: number
}

export default function CommunityMap({
  coordinates
}: IPROPS) {
  const mapRef = React.useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = React.useState(null) as any;

  const zoomToSelectedLoc = (e: React.SyntheticEvent, benef:IBENEF) => {
		// stop event bubble-up which triggers unnecessary events
		e.stopPropagation();
		setSelectedMarker(benef);
		mapRef?.current?.flyTo({ center: [benef.longitude, benef.latitude], zoom: 10 });
	};


  return (
    <div className="bg-card shadow rounded mt-2 col-span-4">
      <Map
        style={{ width: '100%', height: '330px' }}
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

        {selectedMarker ? (
					<MarkerDetails
						selectedMarker={selectedMarker}
						closeSelectedMarker={() => setSelectedMarker(null)}
					/>
				) : null}

        {coordinates.map((benef: any, index:number) => {
					return (
						<Marker key={index} longitude={Number(benef.longitude)} latitude={Number(benef.latitude)}>
							<button
								type="button"
								className="cursor-pointer"
                onClick={(e) => zoomToSelectedLoc(e, benef)}

							>
								{<MapPin size={20} color='green' />}
							</button>
						</Marker>
					);
				})}
      </Map>
    </div>
  );
}
