/**
 * Tile Cache Service for WMS Layer Preloading
 * Preloads and caches WMS tiles for smooth animation playback
 */

interface TileCacheEntry {
  url: string;
  loaded: boolean;
  image: HTMLImageElement | null;
}

class TileCache {
  private cache: Map<string, TileCacheEntry> = new Map();
  private preloadQueue: string[] = [];
  private isPreloading = false;

  /**
   * Generate WMS tile URLs for a given time and layer
   * This approximates the tiles that Leaflet would request for the visible map area
   */
  private generateTileUrls(
    layer: string,
    time: string,
    zoom = 7,
    bounds = { minX: 95, maxX: 102, minY: 24, maxY: 31 },
  ): string[] {
    const baseUrl = 'https://dhm.gov.np/mfd/geoserver/wms/NWP';
    const tileSize = 256;
    const urls: string[] = [];

    // Calculate tile coordinates for Nepal region at the given zoom level
    const numTiles = Math.pow(2, zoom);

    // Convert geographic bounds to tile coordinates
    const minTileX = Math.floor(((bounds.minX + 180) / 360) * numTiles);
    const maxTileX = Math.floor(((bounds.maxX + 180) / 360) * numTiles);
    const minTileY = Math.floor(
      ((1 -
        Math.log(
          Math.tan((bounds.maxY * Math.PI) / 180) +
            1 / Math.cos((bounds.maxY * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
        numTiles,
    );
    const maxTileY = Math.floor(
      ((1 -
        Math.log(
          Math.tan((bounds.minY * Math.PI) / 180) +
            1 / Math.cos((bounds.minY * Math.PI) / 180),
        ) /
          Math.PI) /
        2) *
        numTiles,
    );

    // Generate URLs for each tile
    for (let x = minTileX; x <= maxTileX; x++) {
      for (let y = minTileY; y <= maxTileY; y++) {
        // Calculate BBOX for this tile
        const west = (x / numTiles) * 360 - 180;
        const east = ((x + 1) / numTiles) * 360 - 180;
        const n = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / numTiles)));
        const s = Math.atan(
          Math.sinh(Math.PI * (1 - (2 * (y + 1)) / numTiles)),
        );
        const north = (n * 180) / Math.PI;
        const south = (s * 180) / Math.PI;

        // Convert to EPSG:3857 (Web Mercator)
        const minX = (west * 20037508.34) / 180;
        const maxX = (east * 20037508.34) / 180;
        const minY =
          ((Math.log(Math.tan(((90 + south) * Math.PI) / 360)) /
            (Math.PI / 180)) *
            20037508.34) /
          180;
        const maxY =
          ((Math.log(Math.tan(((90 + north) * Math.PI) / 360)) /
            (Math.PI / 180)) *
            20037508.34) /
          180;

        const bbox = `${minX},${minY},${maxX},${maxY}`;

        const url = `${baseUrl}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=${layer}&FORMAT=image/png&TRANSPARENT=true&WIDTH=${tileSize}&HEIGHT=${tileSize}&SRS=EPSG:3857&BBOX=${bbox}&TIME=${time}`;

        urls.push(url);
      }
    }

    return urls;
  }

  /**
   * Preload tiles for given times and layer
   */
  async preloadTiles(
    layer: string,
    times: Date[],
    currentIndex: number,
    lookahead = 5,
  ): Promise<void> {
    if (!layer || times.length === 0) return;

    // Clear old preload queue
    this.preloadQueue = [];

    // Preload current and next N time steps
    const endIndex = Math.min(currentIndex + lookahead, times.length);

    for (let i = currentIndex; i < endIndex; i++) {
      const time = times[i].toISOString();
      const cacheKey = `${layer}-${time}`;

      // Skip if already cached
      if (this.cache.has(cacheKey) && this.cache.get(cacheKey)?.loaded) {
        continue;
      }

      // Generate representative tile URLs (center tiles of Nepal)
      const tileUrls = this.generateTileUrls(layer, time);

      // Add to cache with loading state
      this.cache.set(cacheKey, {
        url: cacheKey,
        loaded: false,
        image: null,
      });

      // Add to preload queue
      this.preloadQueue.push(...tileUrls);
    }

    // Start preloading if not already running
    if (!this.isPreloading && this.preloadQueue.length > 0) {
      this.startPreloading();
    }
  }

  /**
   * Process preload queue
   */
  private async startPreloading(): Promise<void> {
    this.isPreloading = true;

    // Preload tiles in batches to avoid overwhelming the server
    const batchSize = 3;

    while (this.preloadQueue.length > 0) {
      const batch = this.preloadQueue.splice(0, batchSize);

      await Promise.all(batch.map((url) => this.loadImage(url)));

      // Small delay between batches
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.isPreloading = false;
  }

  /**
   * Load a single image
   */
  private loadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        resolve();
      };

      img.onerror = () => {
        resolve(); // Resolve anyway to continue with other tiles
      };

      img.src = url;
    });
  }

  /**
   * Check if a time step is cached
   */
  isCached(layer: string, time: Date): boolean {
    const cacheKey = `${layer}-${time.toISOString()}`;
    const entry = this.cache.get(cacheKey);
    return entry?.loaded === true;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.preloadQueue = [];
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { total: number; loaded: number } {
    let loaded = 0;
    this.cache.forEach((entry) => {
      if (entry.loaded) loaded++;
    });
    return { total: this.cache.size, loaded };
  }
}

// Export singleton instance
export const tileCache = new TileCache();
