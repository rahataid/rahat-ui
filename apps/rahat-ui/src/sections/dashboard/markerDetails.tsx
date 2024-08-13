import { Popup } from 'react-map-gl';

export default function MarkerDetails({
  selectedMarker,
  closeSelectedMarker,
}: any) {
  return (
    <div>
      <Popup
        offset={25}
        latitude={selectedMarker.geometry.coordinates[1]}
        longitude={selectedMarker.geometry.coordinates[0]}
        onClose={closeSelectedMarker}
        closeButton={true}
        style={{color: 'blue'}}
      >
        <h3>
          Redemption: {selectedMarker?.statsCount || 'N/A'}
          </h3>
      </Popup>
    </div>
  );
}
