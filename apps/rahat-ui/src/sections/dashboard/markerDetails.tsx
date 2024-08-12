import { Popup } from 'react-map-gl';

export default function MarkerDetails({
  selectedMarker,
  closeSelectedMarker,
}: any) {
  console.log('selectedMarker', selectedMarker);
  return (
    <div>
      <Popup
        offset={25}
        latitude={selectedMarker.geometry.coordinates[1]}
        longitude={selectedMarker.geometry.coordinates[0]}
        onClose={closeSelectedMarker}
        closeButton={false}
      >
        <h3>Redemption: {selectedMarker?.statsCount || 'n/a'}</h3>
      </Popup>
    </div>
  );
}
