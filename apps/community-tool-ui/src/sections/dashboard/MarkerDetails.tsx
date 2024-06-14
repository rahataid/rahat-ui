import { Popup } from "react-map-gl";

export default function MarkerDetails({ selectedMarker, closeSelectedMarker }:any) {
	return (
		<div>
			<Popup
				offset={25}
				latitude={selectedMarker.latitude}
				longitude={selectedMarker.longitude}
				onClose={closeSelectedMarker}
				closeButton={false}
			>
				<h3 >{selectedMarker.name}</h3>
			</Popup>
		</div>
	);
}
