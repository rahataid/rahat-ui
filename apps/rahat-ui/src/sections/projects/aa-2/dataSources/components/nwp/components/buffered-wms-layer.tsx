'use client';

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface BufferedWMSLayerProps {
  layer: string;
  time: string;
  opacity: number;
  onLoadComplete?: () => void;
}

/**
 * Buffered WMS Layer that waits for all tiles to load before displaying
 * This prevents the progressive top-to-bottom rendering and creates smooth transitions
 * Keeps previous layer visible until new layer is fully loaded
 */
export function BufferedWMSLayer({
  layer,
  time,
  opacity,
  onLoadComplete,
}: BufferedWMSLayerProps) {
  const map = useMap();
  const currentLayerRef = useRef<L.TileLayer | null>(null);
  const bufferLayerRef = useRef<L.TileLayer | null>(null);
  const loadTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!map || !layer || !time) return;

    // Create a new buffer layer (hidden initially)
    const bufferLayer = L.tileLayer.wms(
      'https://dhm.gov.np/mfd/geoserver/wms/NWP',
      {
        layers: layer,
        format: 'image/png',
        transparent: true,
        version: '1.1.1',
        time: time,
        srs: 'EPSG:3857',
        tileSize: 256,
        opacity: 0, // Start hidden - keeps previous layer visible
        zIndex: 400,
        keepBuffer: 2, // Keep old tiles while loading new ones
      } as L.WMSOptions & Record<string, unknown>,
    );

    // Track tile loading
    let totalTiles = 0;
    let loadedTiles = 0;
    let errorTiles = 0;

    // Timeout to show layer even if not all tiles loaded
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    loadTimeoutRef.current = setTimeout(() => {
      showBufferLayer();
    }, 4000); // 4 second timeout

    const showBufferLayer = () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }

      if (!bufferLayerRef.current) {
        return;
      }

      // Keep current layer visible while transitioning
      if (currentLayerRef.current) {
        // Smooth crossfade transition
        let fadeStep = 0;
        const fadeSteps = 10;
        const fadeInterval = setInterval(() => {
          fadeStep++;
          const progress = fadeStep / fadeSteps;

          if (currentLayerRef.current) {
            currentLayerRef.current.setOpacity(opacity * (1 - progress));
          }

          if (bufferLayerRef.current) {
            bufferLayerRef.current.setOpacity(opacity * progress);
          }

          if (fadeStep >= fadeSteps) {
            clearInterval(fadeInterval);

            // Remove old layer after fade completes
            if (currentLayerRef.current && map) {
              map.removeLayer(currentLayerRef.current);
            }

            // Set buffer as current
            currentLayerRef.current = bufferLayerRef.current;
            bufferLayerRef.current = null;

            onLoadComplete?.();
          }
        }, 30); // 30ms * 10 steps = 300ms total transition
      } else {
        // No previous layer, just fade in
        bufferLayerRef.current.setOpacity(opacity);
        currentLayerRef.current = bufferLayerRef.current;
        bufferLayerRef.current = null;
        onLoadComplete?.();
      }
    };

    // Listen for tile loading events
    bufferLayer.on('tileloadstart', () => {
      totalTiles++;
    });

    bufferLayer.on('tileload', () => {
      loadedTiles++;

      // Show layer when all tiles are loaded
      if (loadedTiles + errorTiles >= totalTiles && totalTiles > 0) {
        showBufferLayer();
      }
    });

    bufferLayer.on('tileerror', () => {
      errorTiles++;

      // Show layer even if some tiles failed (after most are loaded)
      if (loadedTiles + errorTiles >= totalTiles && totalTiles > 0) {
        showBufferLayer();
      }
    });

    // Add buffer layer to map (invisible initially)
    bufferLayer.addTo(map);
    bufferLayerRef.current = bufferLayer;

    // Cleanup
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      if (bufferLayerRef.current && map) {
        map.removeLayer(bufferLayerRef.current);
        bufferLayerRef.current = null;
      }
    };
  }, [map, layer, time, opacity, onLoadComplete]);

  // Update opacity of current visible layer
  useEffect(() => {
    if (currentLayerRef.current) {
      currentLayerRef.current.setOpacity(opacity);
    }
  }, [opacity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentLayerRef.current && map) {
        map.removeLayer(currentLayerRef.current);
        currentLayerRef.current = null;
      }
      if (bufferLayerRef.current && map) {
        map.removeLayer(bufferLayerRef.current);
        bufferLayerRef.current = null;
      }
    };
  }, [map]);

  return null; // This component doesn't render anything directly
}
