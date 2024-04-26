import { memo } from 'react';
import Map, {
    Layer,
    Source,
} from 'react-map-gl';
import { MapBoxProps } from '@rahat-ui/shadcn/src/components/maps';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from '@rahat-ui/shadcn/src/components/maps/clusters/layers';

// ----------------------------------------------------------------------

function MapClusters({ ...other }: MapBoxProps) {
    const geoJsonData = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [82.3886, 29.3863]
                },
                properties: {
                    id: "1",
                }
            },
        ]
    };

    return (
        <Map
            initialViewState={{
                latitude: 28.3949,
                longitude: 84.1240,
                zoom: 5,
            }}
            {...other}
        >
            <Source
                id="earthquakes"
                type="geojson"
                data={geoJsonData}
            // cluster
            // clusterMaxZoom={14}
            // clusterRadius={50}
            >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
            </Source>
        </Map>
    );
}

export default memo(MapClusters);