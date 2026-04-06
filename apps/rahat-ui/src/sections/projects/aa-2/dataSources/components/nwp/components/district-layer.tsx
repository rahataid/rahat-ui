'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  fetchRegionsGeoJSON,
  type RegionFeature,
  type RegionType,
} from '../utils/districts';

interface RegionLayerProps {
  regionType?: RegionType;
  showRegions?: boolean;
  onRegionHover?: (regionName: string | null) => void;
}

export function DistrictLayer({
  regionType = 'district',
  showRegions = true,
  onRegionHover,
}: RegionLayerProps) {
  const map = useMap();
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    async function loadRegions() {
      // Remove old layer if it exists - ONLY our tracked layer
      if (geoJsonLayerRef.current && map.hasLayer(geoJsonLayerRef.current)) {
        map.removeLayer(geoJsonLayerRef.current);
        geoJsonLayerRef.current = null;
      }

      // Also remove any orphaned GeoJSON layers to ensure clean slate
      map.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          map.removeLayer(layer);
        }
      });

      if (!showRegions) return;

      try {
        const data = await fetchRegionsGeoJSON(regionType);
        const geoJsonStyle =
          regionType === 'province'
            ? {
                weight: 2.5,
                opacity: 0.8,
                color: '#000000',
                fillOpacity: 0.08,
                fillColor: '#9ca3af',
              }
            : {
                weight: 1.5,
                opacity: 0.7,
                color: '#000000',
                fillOpacity: 0.05,
                fillColor: '#9ca3af',
              };

        geoJsonLayerRef.current = L.geoJSON(data, {
          style: geoJsonStyle,
          onEachFeature: (feature: RegionFeature, layer: L.Layer) => {
            const regionName =
              feature.properties.name ||
              feature.properties.DISTRICT ||
              feature.properties.PR_NAME ||
              'Unknown';

            // Create popup
            const popupContent = `
              <div class="p-2">
                <h3 class="font-bold text-sm">${regionName}</h3>
                ${
                  feature.properties.PR_NAME
                    ? `<p class="text-xs text-gray-600">Province: ${feature.properties.PR_NAME}</p>`
                    : ''
                }
                ${
                  feature.properties.REGION_CODE
                    ? `<p class="text-xs text-gray-600">Code: ${feature.properties.REGION_CODE}</p>`
                    : ''
                }
              </div>
            `;

            layer.bindPopup(popupContent);

            // Add hover effects
            layer.on('mouseover', () => {
              onRegionHover?.(regionName);

              if (layer instanceof L.Path) {
                layer.setStyle({
                  weight: 2.5,
                  opacity: 1,
                  fillOpacity: 0.2,
                  color: '#ef4444',
                });
                layer.bringToFront();
              }
            });

            layer.on('mouseout', () => {
              onRegionHover?.(null);

              if (layer instanceof L.Path) {
                layer.setStyle({
                  weight: 1.5,
                  opacity: 0.7,
                  fillOpacity: 0.05,
                  color: '#000000',
                });
              }
            });

            layer.on('click', () => {
              layer.openPopup();
            });
          },
        });

        geoJsonLayerRef.current.addTo(map);
      } catch (error) {
        console.error('[v0] Error loading regions:', error);
      }
    }

    loadRegions();

    // Cleanup function
    return () => {
      if (geoJsonLayerRef.current && map.hasLayer(geoJsonLayerRef.current)) {
        map.removeLayer(geoJsonLayerRef.current);
        geoJsonLayerRef.current = null;
      }
    };
  }, [regionType, showRegions, map, onRegionHover]);

  return null;
}
